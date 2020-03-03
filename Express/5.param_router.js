const express = require('./express.alpha_1.0.5/express');
// const express = require('express');
const app = express();

app.get('/home/:id/:name', (req, res) => {
  // console.log(req.params)
  res.end(JSON.stringify(req.params))
})

app.listen(3000, () => {
  console.log('server is listen 3000')
})