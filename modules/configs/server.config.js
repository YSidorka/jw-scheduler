const EnvConfig = require('./env.config');
const AppMiddleware = require('../../mdw/app.mdw');

let _server = null;

function initServer() {
  try {
    const app = AppMiddleware.getApp();
    _server = initHTTPServer(app);
    console.log(`Server::`, _server.address());
  } catch (err) {
    console.log(err);
  }
}

function initHTTPServer(app) {
  return app.listen(EnvConfig.httpPort, () => {
    console.log(`Listening on port ${EnvConfig.httpPort}!`);
  });
}

module.exports = {
  init: () => {
    console.log('Server config');
    initServer();
  }
};
