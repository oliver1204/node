module.exports = {
  _body: '', // 只要有 set 和 get 必须又一个第三方的变量
  get body() {
    return this._body
  },
  set body(newValue) {
    /* 可能的类型
    1. string
    2. Buffer
    3. Stream
    4. Object
    */
   console.log(newValue)
    this._body = newValue
  },
  set(field, val) {
    this.res.setHeader(field, val);
  }
}
