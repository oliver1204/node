const express = require('express');
const article = express.Router();

article.get('/add', function(req, res, next) {
  res.end('article add')
})
article.get('/remove', function(req, res, next) {
  res.end('article remove')
})

module.exports  = article;