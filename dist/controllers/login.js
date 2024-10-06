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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const _DB_1 = __importDefault(require("@DB"));
const user_1 = __importDefault(require("@validators/user"));
const createCookie_1 = __importDefault(require("@services/createCookie"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //validate email and password from request
        const { email, password } = req.body;
        const error = user_1.default.login.validate({ email, password }, { abortEarly: false }).error;
        if (error) {
            throw new Error(error.details[0].message);
        }
        //write this in a cleaner way to handle
        //try to find in db and handle
        const user = yield _DB_1.default.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new Error("Email doesn't exist");
        }
        if (!bcrypt_1.default.compareSync(password, user.password)) {
            throw new Error("Incorrect password. Try again");
        }
        if (user.email_status !== "Activated") {
            throw new Error("Email is not verified");
        }
        //create jwt and store it in a cookie
        const user_token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
        (0, createCookie_1.default)(res, user_token);
        res.status(200).json({
            status: "success",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            user_token,
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
exports.default = login;
