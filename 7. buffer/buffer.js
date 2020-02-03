// // 声明长度为10 的一块内存，默认 00
let buffer = Buffer.alloc(10, 0);

console.log(buffer);

// // 声明一个字符串长度的内存
let buffer1 = Buffer.from('刘子然');

console.log(buffer1);

let r = buffer1.slice(0, 1);
r[1] = 100;
console.log(buffer1[1]);

let buf = Buffer.from('我是前端');

buf.write('后端', 6, 6, 'utf8')
console.log(buf.toString())
let buf1 = Buffer.from('我是');
let buf2 = Buffer.from('前端');

let buf3 = Buffer.alloc(12);
buf1.copy(buf3, 0, 0, 6);
buf2.copy(buf3, 6, 0, 6);
console.log(buf3.toString())

let res = Buffer.concat([buf1, buf2])
console.log(res.toString())