const util = require('util');
const fs = require('fs');
const path = require('path');

let read = util.promisify(fs.readFile)
read(path.resolve(__dirname, './README.md'), 'utf8')
.then((data) => {
  console.log(data)
})


