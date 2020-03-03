class Layer {
  constructor(path, handler) {
    this.path = path;
    this.handler = handler;
  }
  match(pathname) {
    return pathname === this.path
  }
  handle_request(req, res, next) {
    this.handler(req, res, next);
  }
};

module.exports = Layer;