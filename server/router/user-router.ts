import notFound from '../middlewares/not-found';
import { checkSchema } from 'express-validator';
import erroHandler from '../middlewares/errors';
import { getUserData, isLogged, login, logout, getUserPublic, register } from '../controller/user-controller';
import auth from '../middlewares/auth';
import multer from 'multer';
const userRegister = require('../validations/user-register')
const userLogin = require('../validations/user-login')
const express = require('express')

const userRouter = express.Router();
userRouter.use(express.json())
const loginMiddleware = [checkSchema(userLogin)]
const registerMiddleware = [checkSchema(userRegister)]

userRouter.post('/register', registerMiddleware, register)
userRouter.post('/login', loginMiddleware, login)
userRouter.get('/logout', logout)
userRouter.get('/isLogged', isLogged)
userRouter.get('/userDetails', auth, getUserData)
userRouter.get('/user-public/:id', getUserPublic) 

userRouter.use(notFound)
userRouter.use(erroHandler)



export { userRouter };