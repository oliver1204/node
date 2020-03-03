const { pathToRegexp }  = require('path-to-regexp');

class Layer {
  constructor(path, handler) {
    this.path = path;
    this.handler = handler;
    this.regx = pathToRegexp(path, this.keys = []);
    // regx 路径匹配出来的正则
    // keys 动态路由参数
  }
  match(pathname) {
    if(pathname === this.path) return true;
    let match = pathname.match(this.regx)
  
    if(match) {
      // [1, olifer]  [{name: 'id'}, {name: 'name'}] => {id: 1, name: olifer}
      let [, ...value] = match;
      // console.log(value, this.keys) 
      // 两个数组 收敛成一个，用 reduce
      /**
      this.params = this.keys.reduce((memo, current, index) => {
        memo[current.name] = value[index];
        return memo;
      }, {});
      */
      // 上述代码可以简化为 
      this.params = this.keys.reduce((memo, current, index) => (
        memo[current.name] = value[index], memo
        ), {});

      return true;
    }

    if(!this.route) { // 是中间件 use
      if(pathname === '/') {
        return true;
      } else if(pathname.startsWith(this.path + '/')) {
        return true;
      }
    } 
    return false;
  }
  handle_request(req, res, next) {
    this.handler(req, res, next);
  }
  error_handler(error, req, res, next) {
    if(this.handler.length === 4)  {
      return this.handler(error, req, res, next);
    } else {
      next(error)
    }
  }
};

module.exports = Layer;