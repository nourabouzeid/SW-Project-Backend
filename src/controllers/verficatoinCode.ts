import Joi, { ValidationError, ObjectSchema } from "joi";
import Randomstring from "randomstring";
import { Request, Response } from "express";
import sendEmail from "@services/sendEmail";
import db from "@DB";
import { User, Verification } from "@prisma/client";

const verfication_code = {
    generateCode: async (req: Request, res: Response): Promise<void> => {
        try {
            const schema: ObjectSchema = Joi.object({
                email: Joi.string()
                    .email()
                    .pattern(/@gmail\.com$/)
                    .required(),
            });
            const { email } = req.body as Record<string, string>;
            const error: ValidationError | undefined = schema.validate(
                { email },
                { abortEarly: false }
            ).error;
            if (error) {
                throw new Error(error.details[0].message);
            }
            const found_user: User | null = await db.user.findUnique({
                where: { email },
            });
            if (!found_user) {
                throw new Error("Email is not found");
            }
            const code: string = Randomstring.generate(8); // verification code length is exact 8
            const info: string | undefined = await sendEmail(code, email);
            if (!info) {
                throw new Error("Error in sending email");
            }
            await db.user.update({
                where: { email },
                data: {
                    verfication_code: {
                        upsert: {
                            update: { code },
                            create: { code },
                        },
                    },
                },
            });
            res.status(200).json({
                status: "success",
            });
        } catch (e: any) {
            console.log(e.message);
            res.status(400).json({
                status: "failed",
                message: e.message,
            });
        }
    },
    verifyCode: async (req: Request, res: Response): Promise<void> => {
        try {
            const schema: ObjectSchema = Joi.object({
                email: Joi.string()
                    .email()
                    .pattern(/@gmail\.com$/)
                    .required(),
                code: Joi.string().required(),
            });
            const { email, code } = req.body as Record<string, string>;
            const error: ValidationError | undefined = schema.validate(
                { email, code },
                { abortEarly: false }
            ).error;
            if (error) {
                throw new Error(error.details[0].message);
            }
            const data: Verification | null = await db.verification.findUnique({
                where: {
                    code,
                    user: {
                        is: {
                            email,
                        },
                    },
                },
            });
            if (!data) {
                throw new Error("Invalid code");
            }
            let expire_date: Date = new Date();
            expire_date.setDate(expire_date.getDate() - 1);
            if (expire_date > data.created_at) {
                throw new Error("Expried code");
            }
            await db.user.update({
                where: { email },
                data: { email_status: "Activated" },
            });
            res.status(200).json({
                status: "success",
            });
        } catch (e: any) {
            console.log(e.message);
            res.status(400).json({
                status: "failed",
                message: e.message,
            });
        }
    },
};

export default verfication_code;
