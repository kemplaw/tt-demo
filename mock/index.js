const express = require('express')
const app = express()
const PORT = 5000

app.get('/', (req, res) => {
  res.status(200)
  res.send('hello express')
  res.end()
})

app.get('/rest', (req, res) => {
  res.json({
    result: 1,
    msg: 'hello express'
  })
})

app.listen(PORT, () => {
  console.log(`监听 ${PORT} 端口`)
})
