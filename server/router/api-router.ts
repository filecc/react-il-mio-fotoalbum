import { Request, Response } from 'express';
import { index, store } from '../controller/photo-controller';
const express = require('express')

const apiRouter = express.Router();

apiRouter.get('/photos', index)
apiRouter.get('/photos/add', store)

export { apiRouter };