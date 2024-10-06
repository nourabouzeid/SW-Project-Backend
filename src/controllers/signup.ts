import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { ValidationError } from "joi";
import { User } from "@prisma/client";
import Randomstring from "randomstring";
import sendEmail from "@services/sendEmail";
import user_validate from "@validators/user";
import db from "@DB";

const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, confirm_pass }: Record<string, string> =
            req.body;
        const error: ValidationError | undefined =
            user_validate.signup.validate(
                { name, email, password, confirm_pass },
                { abortEarly: false }
            ).error;
        if (error) {
            throw new Error(error.details[0].message);
        }
        const found_user: User | null = await db.user.findUnique({
            where: { email },
        });
        if (found_user && found_user.email_status === "Activated") {
            throw new Error("Email is already found");
        }
        const verification_code: string = Randomstring.generate(8);
        const info: string | undefined = await sendEmail(
            verification_code,
            email
        );
        if (!info) {
            throw new Error("Error in sending email");
        }
        await db.user.upsert({
            where: { email },
            update: {
                name,
                password: bcrypt.hashSync(password, 10),
                verfication_code: {
                    update: {
                        code: verification_code,
                    },
                },
            },
            create: {
                name,
                email,
                password: bcrypt.hashSync(password, 10),
                verfication_code: {
                    create: {
                        code: verification_code,
                    },
                },
            },
        });
        res.status(200).json({
            status: "success",
            user_data: {
                name,
                email,
            },
        });
    } catch (e: any) {
        console.log(e.message);
        res.status(400).json({
            status: "failed",
            message: e.message,
        });
    }
};

export default signup;
