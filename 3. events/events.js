// const EventEmitter = require('events');
const EventEmitter = require('./EventEmitter');
const util = require('util');
// 现在期望自己写一个类来继承这个模块中的原型方法

class Girl extends EventEmitter {}

// util.inherits(Girl, EventEmitter)
let girl = new Girl();

girl.on('newListener', (event) => {
  process.nextTick(() => {
    girl.emit(event, '我');
  });
});
let f1 = (who, status) => {
  console.log(who + status);
};
girl.once('恋爱', () => {
  f1('我', 'ooooo');
});

girl.on('恋爱2', () => {
  f1('你', '也恋爱');
});
girl.on('happy', () => {
  f1('她', 'happy辣');
});

girl.off('恋爱', () => {
  f1('我');
});





