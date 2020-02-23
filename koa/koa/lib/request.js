const url = require('url')
module.exports = {
  get method() { // 在获取值的时候增加一些袭击的方法
    return this.req.method
  },
  get path() { 
    return url.parse(this.req.url)
  }
}