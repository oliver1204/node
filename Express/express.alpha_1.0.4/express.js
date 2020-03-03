const Application = require('./application')

function createApplication() { // express
  return new Application();
}

module.exports = createApplication;