import { index, store } from '../controller/photo-controller';
import notFound from '../middlewares/not-found';
import { checkSchema } from 'express-validator';
const createPhoto = require('../validations/create-photo');
import multer from 'multer';
import erroHandler from '../middlewares/errors';
import auth from '../middlewares/auth';
const express = require('express')

const apiRouter = express.Router();
const createMiddleware = [multer().none(), auth, checkSchema(createPhoto)]

apiRouter.get('/photos', index)
apiRouter.post('/photos/add', createMiddleware, store)

apiRouter.use(notFound)
apiRouter.use(erroHandler)

export { apiRouter };