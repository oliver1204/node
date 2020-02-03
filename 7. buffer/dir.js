const fs = require('fs');
const path = require('path');
const util = require('util');

// fs.mkdirSync(path.resolve(__dirname, './a'))
fs.stat(path.resolve(__dirname, './a'), (err, stats) => {
  console.log(err, stats)
})