const express = require('./express.alpha_1.0.1/express');

const app = express();

app.get('/', (res, req) => {
  req.end('/')
})

app.get('/hello', (res, req) => {
  req.end('/hello')
})

// app.all('*', (res, req) => {
//   req.end('*')
// })

app.listen(3000, () => {
  console.log('server is listen 3000')
})