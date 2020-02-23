// let ctx = {
//   get method () {
//     return this.request.method
//   },

//   get path() {
//     return this.request.path
//   }
// }

// =>

let ctx = {} // 实现 request和response的 属性和方法的代理

function defineGetter(property, key) {
  ctx.__defineGetter__(key, function() {
    return this[property][key]
  })
}

function defineSetter(property, key) {
  ctx.__defineSetter__(key, function(value) {
    console.log(value)
    this[property][key] = value
  })
}

defineGetter('request', 'method');
defineGetter('request', 'path');
defineGetter('response', 'body');

defineSetter('response', 'body');
defineSetter('response', 'set');


module.exports = ctx


 /**
 * 源码中用了delegate
 * const delegate = require('delegates');
 * 
 * delegates 原理就是__defineGetter__和__defineSetter__
 * method是委托方法，getter委托getter,access委托getter和setter。
 * 
 // proto.status => proto.response.status
 delegate(proto, 'response')
  .access('status')
  .access('body')
 * context.js代理了request和response。ctx.body指向ctx.response.body。
 * 但是此时ctx.response ctx.request还没注入！
 */

 /**
  * 可能会有疑问，
  * 为什么response.js和request.js使用get set代理，
  * 而context.js使用delegate代理? 
  * 原因主要是 set和get方法里面还可以加入一些自己的逻辑处理。
  * 而delegate就比较纯粹了，只代理属性。
  * 
  * 因此context.js比较适合使用delegate，仅仅是代理request和response的属性和方法。
  */