import notFound from '../middlewares/not-found';
import { checkSchema } from 'express-validator';
import multer from 'multer';
import erroHandler from '../middlewares/errors';
import { login } from '../controller/user-controller';
const express = require('express')

const userRouter = express.Router();

userRouter.post('/login', login)

userRouter.use(notFound)
userRouter.use(erroHandler)



export { userRouter };