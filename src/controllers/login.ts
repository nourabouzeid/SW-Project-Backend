import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "@DB";
import { ValidationError } from "joi";
import user_validate from "@validators/user";
import createCookie from "@services/createCookie";

const login = async (req: Request, res: Response) => {
    try {
        //validate email and password from request
        const { email, password }: Record<string, string> = req.body;
        const error: ValidationError | undefined = user_validate.login.validate(
            { email, password },
            { abortEarly: false }
        ).error;
        if (error) {
            throw new Error(error.details[0].message);
        }
        //write this in a cleaner way to handle
        //try to find in db and handle
        const user = await db.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new Error("Email doesn't exist");
        }
        if (!bcrypt.compareSync(password, user.password)) {
            throw new Error("Incorrect password. Try again");
        }
        if (user.email_status !== "Activated") {
            throw new Error("Email is not verified");
        }

        //create jwt and store it in a cookie
        const user_token: string = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET as string,
            { expiresIn: process.env.JWT_EXPIRE }
        );
        createCookie(res, user_token);
        res.status(200).json({
            status: "success",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            user_token,
        });
    } catch (e: any) {
        console.log(e.message);
        res.status(400).json({
            status: "failed",
            message: e.message,
        });
    }
};

export default login;
