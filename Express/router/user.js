const express = require('express');
const user = express.Router();

user.get('/add', function(req, res, next) {
  res.end('user add')
})
user.get('/remove', function(req, res, next) {
  res.end('user remove')
})

module.exports  = user;