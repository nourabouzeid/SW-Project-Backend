"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const google_1 = __importDefault(require("./google"));
const authentication_1 = __importDefault(require("./authentication"));
const user_1 = __importDefault(require("./user"));
const userAuth_1 = __importDefault(require("@middlewares/userAuth"));
const router = (0, express_1.Router)();
router.use('/', google_1.default);
router.use('/', authentication_1.default);
router.use(userAuth_1.default);
router.use('/', user_1.default);
exports.default = router;
