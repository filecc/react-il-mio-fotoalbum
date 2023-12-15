import notFound from '../middlewares/not-found';
import { checkSchema } from 'express-validator';
import erroHandler from '../middlewares/errors';
import { getUserData, isLogged, login, logout, getUserPublic } from '../controller/user-controller';
import auth from '../middlewares/auth';
const userLogin = require('../validations/user-login')
const express = require('express')

const userRouter = express.Router();
userRouter.use(express.json())
userRouter.post('/login', checkSchema(userLogin), login)
userRouter.get('/logout', logout)
userRouter.get('/isLogged', isLogged)
userRouter.get('/userDetails', auth, getUserData)
userRouter.get('/user-public/:id', getUserPublic)

userRouter.use(notFound)
userRouter.use(erroHandler)



export { userRouter };