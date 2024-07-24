require('dotenv').config();
const express = require('express');
const app = express();

const port = process.env.PORT

// home route
app.get('/', (req, res) => {
  res.send('Home Page');
});

app.get('/demo', (req, resp) => {
  resp.send("JS Backend | Demo Page");
});

// login route
app.get('/login', (req, resp) => {
  resp.send("<h1> Log in please </h1>");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
