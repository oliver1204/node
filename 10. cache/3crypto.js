const crypto = require('crypto');

// md5
let r = crypto.createHash('md5').update('1').digest('base64');
r = crypto.createHash('md5').update('12').digest('base64');
console.log(r)

let s = crypto.createHmac('sha1', 'olifer').update('olifer').digest('base64'); 
console.log(s)