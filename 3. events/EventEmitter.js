class EventEmitter {
  constructor() {
    this._events = Object.create(null);
  }
  on(eventName, callback) {
    if(eventName !== 'newListener') {
      let listener = this._events.newListener;
      if(listener) {
        this.emit('newListener', eventName);
      }
    }
    let stack = this._events[eventName] || [];
    stack.push(callback);
    this._events[eventName] = stack;
  }
  once(eventName, callback) {
    // 先绑定， 绑定完成触发后再删除
    let one = (...args) => {
      callback(...args); // 原函数， 原函数执行后，将自己删除
      this.off(eventName, one)
    };
    one.l = callback;
    this.on(eventName, one);
  }
  off(eventName, callback) {
    if(this._events[eventName]) {
      
      this._events[eventName] = this._events[eventName].filter(fn => {
        // 如果绑定的one 和 要关闭的回调一样也删除
        return fn !== callback && fn.l !== callback;
      }) 
    }
  }
  emit(eventName, ...args) {
    let events = this._events[eventName];
    if(events) {
      events.map(fn => {
        fn(...args);
      })
    }
  }
}

module.exports = EventEmitter;