import { Request, Response } from 'express';
import { index } from '../controller/photo-controller';
const express = require('express')

const apiRouter = express.Router();

apiRouter.get('/photos', index)

export { apiRouter };