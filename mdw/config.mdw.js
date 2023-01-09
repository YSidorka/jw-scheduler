const express = require('express');
const cookieParser = require('cookie-parser');
const { setResponseHeader } = require('../common/utils');

const bodyParserMdw = express.Router();
const cookieParserMdw = express.Router();

function appMdwConfigInit(app) {
  try {
    // To remove X-Powered-By in ExpressJS
    app.disable('x-powered-by');
    app.set('trust proxy', true);

    setBodyParser(bodyParserMdw);

    // Cookie parser to object
    setCookieParser(cookieParserMdw);
  } catch (err) {
    console.log(`Error appMdwConfigInit:`, err.message);
  }
}

function setBodyParser(router) {
  // parse application/vnd.api+json as json
  router.use(express.urlencoded({ extended: true }));

  // get all data/stuff of the body (POST) parameters
  router.use(express.json());
  router.use(
    express.json({
      limit: '5mb',
      type: 'application/vnd.api+json'
    })
  );
}

function setCookieParser(router) {
  router.use(cookieParser());
}

function errorHandlerMdw(err, req, res, next) {
  if (!err) next();
  setResponseHeader(res, { appJSON: true, noRobots: true, noCache: true });

  const code = err.code || 500;
  return res.status(code).send({ code, ...err });
}

module.exports = {
  init: (app) => {
    console.log('App config / middleware');
    appMdwConfigInit(app);
  },

  $BODYParser: bodyParserMdw,
  $COOKIEParser: cookieParserMdw,
  $ERRORHandler: errorHandlerMdw
};
