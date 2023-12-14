const express = require('express');
const app = express();
const port = 4000
const apiRouter = require('./router/api-router.js');


app.get('/', (req, res) => {
    res.json('Api available at /api!')
    }
)
app.use('/api', apiRouter);

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
    }
)

