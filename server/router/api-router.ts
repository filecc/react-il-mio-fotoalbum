import { Request, Response } from 'express';
import { index, store } from '../controller/photo-controller';
import notFound from '../middlewares/not-found';
const express = require('express')

const apiRouter = express.Router();

apiRouter.get('/photos', index)
apiRouter.get('/photos/add', store)

apiRouter.use(notFound)

export { apiRouter };