class Layer {
  constructor(path, handler) {
    this.path = path;
    this.handler = handler;
  }
  match(pathname) {
    if(pathname === this.path) return true;

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