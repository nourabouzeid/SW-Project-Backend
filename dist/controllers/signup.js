"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const randomstring_1 = __importDefault(require("randomstring"));
const sendEmail_1 = __importDefault(require("@services/sendEmail"));
const user_1 = __importDefault(require("@validators/user"));
const _DB_1 = __importDefault(require("@DB"));
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, confirm_pass } = req.body;
        const error = user_1.default.signup.validate({ name, email, password, confirm_pass }, { abortEarly: false }).error;
        if (error) {
            throw new Error(error.details[0].message);
        }
        const found_user = yield _DB_1.default.user.findUnique({
            where: { email },
        });
        if (found_user && found_user.email_status === "Activated") {
            throw new Error("Email is already found");
        }
        const verification_code = randomstring_1.default.generate(8);
        const info = yield (0, sendEmail_1.default)(verification_code, email);
        if (!info) {
            throw new Error("Error in sending email");
        }
        yield _DB_1.default.user.upsert({
            where: { email },
            update: {
                name,
                password: bcrypt_1.default.hashSync(password, 10),
                verfication_code: {
                    update: {
                        code: verification_code,
                    },
                },
            },
            create: {
                name,
                email,
                password: bcrypt_1.default.hashSync(password, 10),
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
    }
    catch (e) {
        console.log(e.message);
        res.status(400).json({
            status: "failed",
            message: e.message,
        });
    }
});
exports.default = signup;
