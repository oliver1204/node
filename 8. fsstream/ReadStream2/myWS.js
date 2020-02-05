/**
 * 第一次向文件中写入
 * 第二次 把内容放在内存中
 * 第一次写入成功后，清空缓存中的第一项
 * 缓存中的第一项被清空后，再清空第二个。。。
 * 都清空后，看是否需要触发drain事件，
 * 是的话，重新执行write方法
*/
const EventEmitter = require('events');
const fs = require('fs');

class MyWs extends EventEmitter {
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
    this.ended = options.end || Infinity;
    this.highWaterMark = options.highWaterMark || 64 * 1024;
    
    this.pos = this.start; // 写入的位置
    this.cathe = [];
    this.isWriting = false; // 是否正在写入
    this.len = 0; // 写入的长度
    this.needDrain = false; // 申请的内存是否被用完了,需要触发Drain事件了

    this.open();
  }
  open() {
    fs.open(this.path, this.flags, (err, fd) => {
      if(err) this.emit('error');
      this.fd = fd;
      this.emit('open')
    })
  }
  write(chunk, encoding = this.encoding, callback = () => {}) {
    console.log(chunk)
    if(typeof chunk !== 'string' && !Buffer.isBuffer(you)) {
      this.error('The "chunk" argument must be one of type string or Buffer');
    }
    // fs.write 写入buffer和写入string，参数是不一样的，所以这里统一处理为buffer
    let buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    this.len += buffer.length;

    if(this.len >= this.highWaterMark) {
      this.needDrain = true;
    }
    
    if(this.isWriting) { // 正在写入，那么就写入内存中
      this.cathe.push({
        encoding,
        chunk: buffer, 
        callback
      })
    } else { // 第一次写入
      this.isWriting = true; 
      this._write(buffer, encoding, () => {
        this.clearCathe();
        callback();
      });
    }

    return !this.needDrain;
  }
  clearCathe() {
    let current = this.cathe.shift();

    if(current) {
      this._write(current.chunk, current.encoding, () => {
        current.callback();
        this.clearCathe();
      })
    } else { // 缓存清空了
      if(this.needDrain) { 
        this.needDrain = false;
        this.isWriting = false;
        this.emit('drain')
      }
    }
  }
  _write(chunk, encoding, callback) {
    if(typeof this.fd !== 'number') { // 发布订阅
      return this.once('open', () => this._write(chunk, encoding, callback))
    };

    fs.write(this.fd, chunk, 0, chunk.length, this.pos, (err, written) => {
      if(err) this.emit('error');
      this.pos += written;
      this.len -= written;

      callback();
    })
  }
  end(chunk, encoding = this.encoding, callback = () => {}) {
    // this.write(chunk, encoding, callback);
    fs.close(this.fd, () => {
      console.log('写入过程完成！')
    })
  }
  error(err) {
    throw Error(err);
  }
}

module.exports = MyWs;