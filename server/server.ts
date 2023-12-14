import notFound from './middlewares/not-found';
import { apiRouter } from './router/api-router';
import { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import erroHandler from './middlewares/errors';
const express = require('express')

const app = express();
const port = 4000

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionSuccessStatus: 200,
    methods: 'GET,POST,PUT'
  }

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('/', (req: Request, res: Response) => {
    res.json('Api available at /api!')
    }
)
app.use('/api', apiRouter);
app.use(notFound)
app.use(erroHandler)

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
    }
)

