const {
  Readable,
  Writable,
  Duplex,
  Transform
} = require('stream');
// 4. 转化流
class myTransform extends Transform {
  constructor() {
    super();
  }
  // 可以由写流变为读流或者由读流变为写流
  _transform(chunk, encoding, cb) { 
    console.log(chunk);
    cb();
  }
}

// 读流
process.stdin.on('data', (chunk) => {
  // 写流
  process.stdout.wirte(chunk)
})

// 上面的代码可以简化为： => 

process.stdin.pipe(process.stdout)

// 如果需要转化
let t = new myTransform
process.stdin.pipe(t).pipe(process.stdout);

// 3. Duplex
class myDuplex extends Duplex {
  constructor() {
    super();
  }
  _write(chunk, encoding, cb) {
    console.log(chunk)
    cb();
  }
  _read() {
    this.push('aa'); 
    this.push(null);
  }
}
// 2. 写
class myWriteStream extends Writable {
  constructor() {
    super();
  }
  _write(chunk, encoding, cb) {
    console.log(chunk)
    cb();
  }
}

let ws = new myWriteStream;

ws.write('123')
ws.write('123')
ws.write('123')
// 1. 可读又可写的流
class myReadStream extends Readable {
  constructor() {
    super();
    this.index = 0;
  }
  _read() {//变为流的形式
    // push的必须是 string or buffer
    this.push(this.index++ + ''); //触发on('data')
    if(this.index > 9) {
      this.push(null); // 触发on('end')
    }
  }
}

let rs = new myReadStream;
let arr = []

rs.on('data', (chunk) => {
  arr.push(chunk);
})

rs.on('end', () => {
  console.log(Buffer.concat(arr).toString())
})

