import { User } from "@prisma/client";
import db from "src/prisma/PrismaClient";
import bcrypt from "bcrypt";

const findUser = async (email: string, password: string): Promise<void> => {
    const found_user: User | null = await db.user.findUnique({
        where: { email },
    });
    if (found_user && found_user.email_status === "Activated") {
        throw new Error("Email is already found");
    }
};

const upsertUser = async (
    name: string,
    email: string,
    password: string,
    verification_code: string
): Promise<void> => {
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
};

export { findUser, upsertUser };
