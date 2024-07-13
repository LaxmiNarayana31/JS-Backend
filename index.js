const express = require('express')
const app = express()
const port = 4000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/demo', (req, resp) => {
    resp.send("JS Backend")
})

app.get('/login', (req, resp) => {
    resp.send("<h1> Log in please </h1>")
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})