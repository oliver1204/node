const Layer = require('./layer');
const methods = require('methods');

class Route {
  constructor() {
    this.stack = [];
    this.methods = {};
  }
  dispatch(req, res, out) {
    let idx = 0;

    let dispatch = (error) => { 
      if(error) return out(error, req, res);
      if(idx === this.stack.length) return  out(req, res);

      let layer = this.stack[idx++];
      let method = req.method.toLowerCase();

      if(layer.method === method) {
        layer.handle_request(req, res, dispatch);
      } else {
        dispatch(error);
      }
    }
    dispatch();
  }
}

methods.map((method) => {
  Route.prototype[method] = function(handlers) {
    handlers.forEach(handler => {
      let layer = new Layer('/', handler);
      layer.method = method;
      this.methods[method] = true;
      this.stack.push(layer)
    });
  }
})

module.exports = Route;