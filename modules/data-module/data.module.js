const dataJSON = require('../../docs/data.json');

function envInit(env) {
  try {
    const result = {};

    Object.keys(env).forEach((key) => {
      if (!env[key]) return;
      const docId = `${env[key]}`;
      result[key] = docId && dataJSON && dataJSON[docId] ? dataJSON[docId] : env[key];
    });
    return result;
  } catch (err) {
    console.log('Error: envInit', err.message);
    return null;
  }
}

module.exports = {
  envInit
};
