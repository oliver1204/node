const express = require('./express.alpha_1.0.6/express');
// const express = require('express');
const app = express();
const user = require('./router/user');
const article = require('./router/article');

app.use('/user', user);
app.use('/article', article);

app.listen(3000, () => {
  console.log('server is listen 3000')
})
