const fs = require('fs');
const express = require('express');
const port = 3000;

const app = express();

// MIDDLEWARE
app.use(express.json());

//app.get('/', (req,res) => {
//    res.status(200).json({message: 'Hello from the server side!'});
//})

const tourList = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req,res) => {
    res.status(200).json({
        status: `success`, 
        results: tourList.length,
        data: {
            tours: tourList
        }
    })
})

app.post(`1/api/v1/tours`, (res, req) => {
   console.log(req.body); 
   res.send(`done`);
})
app.listen(port, () => {
    console.log(`App running on port ${port}...`)
})

