import { apiRouter } from './router/api-router';
import { Request, Response } from 'express';
const express = require('express')

const app = express();
const port = 4000


app.get('/', (req: Request, res: Response) => {
    res.json('Api available at /api!')
    }
)
app.use('/api', apiRouter);

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
    }
)

