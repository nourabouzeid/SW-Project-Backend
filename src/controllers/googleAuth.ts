import { Request, Response } from 'express';
import db from '@DB';
import bcrypt from 'bcrypt';
import randomstring from 'randomstring';
import getUserData from '@services/googleToken';
import jwt from 'jsonwebtoken';
import createCookie from '@services/createCookie';


async function googleAuth(req: Request, res: Response): Promise<void> {
    try {
        const token: string | undefined = req.body.token; // google token after sign-up or login using google service
        if (!token) {
            throw new Error('There is no token');
        }
        const data = await getUserData(token);
        if (!data) {
            throw new Error('Invalid token');
        }
        const user_data: { name: string, email: string, password: string, email_status: string } = {
            name: data.name,
            email: data.email,
            password: bcrypt.hashSync(randomstring.generate({ length: 250 }), 10),
            email_status: 'Activated'
        };
        const user = await db.user.upsert({
            where: { email: user_data.email },
            update: {},
            create: user_data
        });
        const user_token: string = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRE });
        createCookie(res, user_token);
        res.status(200).json({
            status: 'success',
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            user_token
        });
    } catch (err: any) {
        console.log(err.message);
        res.status(400).json({
            status: 'failed',
            message: err.message
        });
    }
}

export default googleAuth;