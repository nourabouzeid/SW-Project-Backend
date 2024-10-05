import { Router } from "express";
import googleAuth from "./googleAuth";
import authenticationRouter from "./authentication";
import userRouter from "./user";
import userAuth from "@middlewares/userAuth";

const router: Router = Router();

router.use("/", googleAuth);
router.use("/", authenticationRouter);
router.use(userAuth);
router.use("/", userRouter);

export default router;
