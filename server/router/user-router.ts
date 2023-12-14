import notFound from '../middlewares/not-found';
import { checkSchema } from 'express-validator';
import multer from 'multer';
import erroHandler from '../middlewares/errors';
import { login } from '../controller/user-controller';
const userLogin = require('../validations/user-login')
const express = require('express')

const userRouter = express.Router();
const loginMiddleware = [multer().none(), checkSchema(userLogin)]
userRouter.post('/login', loginMiddleware, login)

userRouter.use(notFound)
userRouter.use(erroHandler)



export { userRouter };