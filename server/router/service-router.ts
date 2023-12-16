import notFound from '../middlewares/not-found';
import erroHandler from '../middlewares/errors';
import multer from 'multer';
import { sendMessage } from '../controller/service-controller';
const express = require('express')

const serviceRouter = express.Router();
serviceRouter.use(express.json())
const messageMiddleware = [multer().none()]

serviceRouter.post('/message', messageMiddleware, sendMessage)


serviceRouter.use(notFound)
serviceRouter.use(erroHandler)



export { serviceRouter };