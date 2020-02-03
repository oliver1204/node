const EventEmitter = require('events');
const fs = require('fs');

class myRS extends EventEmitter {
  constructor(path, options = {}) {
    super();
    this.path = path;
    this.flags = options.flags || 'r';
    this.encoding = options.encoding || null;
    this.fd = options.fd || null;
    this.mode = options.flags || 0o666;
    this.autoClose = options.autoClose || true;
    this.emitClose = options.emitClose || false;
    this.start = options.start || 0;
    this.end = options.end || Infinity;
    this.highWaterMark = options.highWaterMark || 64 * 1024;
    
    this.position = this.start;
    this.flowing = null; // 默认非流动模式

    this.open(); // 只要创建可读流，就默认的将这个文件打开
    this.on('newListener', (event) => {
      if(event === 'data') this.resume();
    })
  }
  destroy(err) {
    if(typeof this.fd === 'number' && this.autoClose) this.close();
    if(err) this.emit('error', err);
  }
  open() {
    fs.open(this.path, this.flags, (err, fd) => {
      if(err) this.destroy(err);
      this.fd = fd;
      this.emit('open', fd)

    })
  }
  read() {  // 发布订阅
    if(typeof this.fd !== 'number') {
      // 第一次调read 不会立即执行，而是等this.emit('open', fd)后再执行
      return this.once('open', this.read); 
    }
    // 每次都要新创建一个buffer，否则后一个buffer的值会覆盖前一个值
    let howMuchToRead = this.end ? Math.min(this.end - this.position, this.highWaterMark) : this.highWaterMark;
    let buffer = Buffer.alloc(howMuchToRead);

    fs.read(this.fd, buffer, 0, howMuchToRead, this.position, (err, bytesRead, buffer ) => {
      if(err) this.destroy(err);
      if(bytesRead && this.position <= this.end)   {
        this.position += bytesRead;
        this.emit('data', buffer);
        if(this.flowing) {
          this.read(); // 然后一直读，直到读不到东西为止。
        }
      } else {
        this.emit('end');
        this.close();
      }
    })
  }
  close() {
    fs.close(this.fd, () => {
      this.emit('close');
    })
  }
  pause() {
    this.flowing = false;
  }
  resume() {
    this.flowing = true;
    this.read();
  }
}

module.exports = myRS;