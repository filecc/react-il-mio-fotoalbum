import { Request, Response } from 'express';
const express = require('express')

const apiRouter = express.Router();

apiRouter.get('/', (req: Request, res: Response) => {
    res.json('Hello World!')
    }
)

export { apiRouter };