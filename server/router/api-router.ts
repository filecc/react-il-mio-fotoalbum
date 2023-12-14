import { deletePhoto, index, show, store } from '../controller/photo-controller';
const express = require('express')
import notFound from '../middlewares/not-found';
import { checkSchema } from 'express-validator';
const createPhotoValidation = require('../validations/create-photo');
const deletePhotoValidation = require('../validations/delete-photo');
const showPhotoValidation = require('../validations/show-photo');
import multer from 'multer';
import erroHandler from '../middlewares/errors';
import auth from '../middlewares/auth';


const apiRouter = express.Router();
const createMiddleware = [multer({dest: "public/images"}).single("image"), checkSchema(createPhotoValidation)]


apiRouter.get('/photos', index)
apiRouter.use('/photos/', auth)
apiRouter.post('/photos/add', createMiddleware, store)
apiRouter.delete('/photos/delete/:id', checkSchema(deletePhotoValidation), deletePhoto)
apiRouter.get('/photo/:id', checkSchema(showPhotoValidation), show)

apiRouter.use(notFound)
apiRouter.use(erroHandler)

export { apiRouter };