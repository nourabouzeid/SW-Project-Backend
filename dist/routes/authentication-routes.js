"use strict";
/**
 * @swagger
 * paths:
 *  /login:
 *   post:
 *     summary: Try to login the application
 *     operationID: Login
 *     tags:
 *      - Authentication - Registration
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          email:
 *           type: string
 *          password:
 *           type: string
 *     responses:
 *       200:
 *         description: data of user
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                status:
 *                 type: string
 *                user_token:
 *                 type: string
 *                user:
 *                 type: object
 *                 properties:
 *                  id:
 *                   type: integer
 *                  name:
 *                   type: string
 *                  email:
 *                   type: string
 *
 *  /signup:
 *   post:
 *     summary: Try to signup new user in the application
 *     operationID: SignUp
 *     tags:
 *      - Authentication - Registration
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          name:
 *           type: string
 *          email:
 *           type: string
 *          password:
 *           type: string
 *          confirm_pass:
 *           type: string
 *           description: the same password for confirmation
 *
 *     responses:
 *       200:
 *         description: data of user
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                status:
 *                 type: string
 *                user_data:
 *                 type: object
 *                 properties:
 *                  name:
 *                   type: string
 *                  email:
 *                   type: string
 *
 *  /generateCode:
 *   post:
 *     summary: Generate Code for verify user's email
 *     operationID: Generate Code
 *     tags:
 *      - Authentication - Registration
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          email:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: data of user
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                status:
 *                 type: string
 *
 *  /verifyCode:
 *   post:
 *     summary: Verify Code to activate user's email
 *     operationID: Verify Code
 *     tags:
 *      - Authentication - Registration
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          email:
 *           type: string
 *          code:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: data of user
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                status:
 *                 type: string
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const login_controller_1 = __importDefault(require("@controllers/login-controller"));
const signup_controller_1 = __importDefault(require("@controllers/signup-controller"));
const verification_controller_1 = require("@controllers/verification-controller");
const router = (0, express_1.Router)();
router.post("/login", login_controller_1.default);
router.post("/signup", signup_controller_1.default);
router.post("/generateCode", verification_controller_1.generateCode);
router.post("/verifyCode", verification_controller_1.verifyCode);
exports.default = router;
