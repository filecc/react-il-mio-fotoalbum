import { deletePhoto, edit, index, indexPerAuthor, show, store } from '../controller/photo-controller';
const express = require('express')
import notFound from '../middlewares/not-found';
import { checkSchema } from 'express-validator';
const createPhotoValidation = require('../validations/create-photo');
const deletePhotoValidation = require('../validations/delete-photo');
const showPhotoValidation = require('../validations/show-photo');
const editPhotoValidation = require('../validations/edit-photo');
import multer from 'multer';
import erroHandler from '../middlewares/errors';
import auth from '../middlewares/auth';
import checkUserID from '../middlewares/check-user-id';


const apiRouter = express.Router(); 
const createMiddleware = [checkUserID, multer({dest: "public/images"}).single("file"), checkSchema(createPhotoValidation)]
const editMiddleware = [checkUserID, multer({dest: "public/images"}).single('file'), checkSchema(editPhotoValidation)]
const deleteMiddleware = [checkUserID, checkSchema(deletePhotoValidation)]

apiRouter.get('/photos', index)
apiRouter.use('/photos/', auth)

apiRouter.post('/photos/add', createMiddleware, store)
apiRouter.delete('/photos/delete/:id', deleteMiddleware, deletePhoto)
apiRouter.get('/photo/:id', checkSchema(showPhotoValidation), show)
apiRouter.put('/photos/edit/:id', editMiddleware, edit)
apiRouter.get('/photos/user', checkUserID, indexPerAuthor)

apiRouter.use(notFound)
apiRouter.use(erroHandler)

export { apiRouter };