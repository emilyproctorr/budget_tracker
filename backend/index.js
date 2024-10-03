// purpose of index.js -> establish logice for Node.js server, enable listening for incoming requests and respond to those requests

// import
const express = require('express');
const cors = require('cors');

// create express application
const app = express();

app.get('/', (req, res) => {
    res.send('<h1>Hello, Express.js Server!</h1>');
});

// define port
const port = process.env.PORT || 5001;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})