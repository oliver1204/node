
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

let filePath = path.resolve(__dirname, 'index.html')
let html = fs.readFileSync(filePath, 'utf8');

let newHtml = ejs.render(html, {
  name: 'olifer',
  age: 10,
  arr: [1, 3, 3]
})

console.log(newHtml)