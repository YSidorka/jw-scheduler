const express = require('express');
const { MEMORY_ROUTE } = require('@jw/const');
const { setResponseHeader } = require('sky-utils');

const router = express.Router();

router.get(MEMORY_ROUTE, async (req, res, next) => {
  setResponseHeader(res, { appJSON: true, noRobots: true, noCache: true });
  try {
    // memory
    const used = process.memoryUsage();
    const result = {};
    Object.keys(used).forEach((key) => {
      result[key] = `${Math.round((used[key] / 1024 / 1024) * 100) / 100} MB`;
    });
    return res.send(result);
  } catch (err) {
    return next({ message: `GET ${MEMORY_ROUTE}: ${err.message}` });
  }
});

module.exports = router;
