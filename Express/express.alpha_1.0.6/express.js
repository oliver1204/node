const Application = require('./application')
const Router = require('./router/index.js');

function createApplication() { // express
  return new Application();
}
createApplication.Router = new Router();
module.exports = createApplication;