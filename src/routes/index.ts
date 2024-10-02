import { Router } from 'express'
import googleRouter from './google';
import authenticationRouter from './authentication';
import userRouter from './user';
import userAuth from '@middlewares/userAuth';

const router: Router = Router();

router.use('/', googleRouter);
router.use('/', authenticationRouter);
router.use(userAuth);
router.use('/', userRouter);

export default router;