const express = require('./express.alpha_1.0.2/express');

const app = express();

app.get('/', (req, res, next) => {
  console.log(1)
  next()
  res.end('ok one')
}, (req, res, next) => {
  console.log(11)
  next()
}, (req, res, next) => {
  console.log(111)
})

app.get('/hello', (req, res, next) => {
  console.log(22);
  res.end('ok')
})

app.post('/a', (req, res, next) => {
  console.log(333);
  res.end('ok a')
})


app.listen(3000, () => {
  console.log('server is listen 3000')
})