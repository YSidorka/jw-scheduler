function cloneObj(obj) {
  return JSON.parse(JSON.stringify(obj));
}

async function sleep(time) {
  return new Promise((resolve) => setTimeout(() => resolve(), time));
}

function calcSize(o) {
  const value = o && typeof o === 'string' ? o : JSON.stringify(o);
  return `${(value.length / 1000000).toFixed(2)}MB`;
}

function diffDate(startDate, endDate) {
  try {
    const startValue = startDate.valueOf();
    const endValue = endDate ? endDate.valueOf() : new Date().valueOf();

    return ((endValue - startValue) / 1000).toFixed(2);
  } catch (err) {
    console.log(`Error: diffDate - ${err}`);
    return null;
  }
}

function uniqueArray(array) {
  return [...new Set(array)];
}

function clearString(str) {
  return str.length < 12 ? str : ` ${str}`.slice(1);
}

function setResponseHeader(res, { appJSON, appXML, textPlain, noRobots, noCache, setCache }) {
  try {
    if (appJSON) res.setHeader('Content-Type', 'application/json');
    if (appXML) res.setHeader('Content-Type', 'application/xml');
    if (textPlain) res.setHeader('Content-Type', 'text/plain');
    if (noRobots) res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    if (noCache) res.setHeader('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate');
    if (setCache) res.setHeader('Cache-Control', 'public, max-age=31536000');
  } catch (err) {
    console.log(`setResponseHeader:`, err.message);
  }
}

module.exports = {
  cloneObj,
  sleep,
  calcSize,
  diffDate,
  uniqueArray,
  clearString,

  setResponseHeader
};
