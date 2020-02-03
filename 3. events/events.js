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
  })
})
let f1 = (who) => {
  console.log(who + '哈哈哈！')
}
girl.once('恋爱', f1)
girl.once('恋爱', (who) => {
  console.log(who + '亲爱的')
})

girl.on('happy', (who) => {
  console.log(who + 'happy')
})

girl.off('恋爱', f1)




