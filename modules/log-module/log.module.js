const { TYPE_LOG, DAY, SECOND } = require('@jw/const');

const {
  getDocumentList,
  getDocument,
  createDocument,
  updateDocument
} = require('../data-module/data.service');

const logsMap = {};
let nextSyncDate = 0;
const TIMEOUT = 15 * SECOND;

async function getAllLogsByWorkerId(workerId, date) {
  try {
    const docs = await getLogCollection(date);
    const result = [];

    docs.forEach((doc) => {
      const logArray = doc.map && doc.map[workerId];
      if (Array.isArray(logArray)) result.push(...logArray);
    });

    // get logs from env
    if (Array.isArray(logsMap[workerId])) result.push('', ...logsMap[workerId]);
    return result;
  } catch (err) {
    console.log(`Error getAllLogsByWorkerId(${workerId}): ${err.message}`);
    return [];
  }
}

async function addLogMessage(workerId, msgObj) {
  try {
    if (!Array.isArray(logsMap[workerId])) logsMap[workerId] = [];
    const logArray = logsMap[workerId];

    if (logArray.length > 0) {
      const prevItem = logArray.pop();
      const substr = prevItem.split(' | ')[1].substring(0, 10); // simple solution

      // if prevItem not similar keep it at log
      if (!msgObj.startsWith(substr)) logArray.push(prevItem);
    }

    logArray.push(`${new Date().toISOString()} | ${msgObj}`);

    const date = Date.now();
    if (nextSyncDate < date) {
      setTimeout(updateLogStore, TIMEOUT);
      nextSyncDate = date + TIMEOUT;
    }
  } catch (err) {
    console.log(`Error addLogMessage: ${err.message}`);
  }
}

function getUTCStartDay(date) {
  const days = date ? new Date(date).valueOf() : Date.now();
  const truncate = Math.trunc(days / DAY);
  return truncate * DAY;
}

async function getLogDocument(date) {
  try {
    const startUTCDay = getUTCStartDay(date);
    const options = {
      type: TYPE_LOG,
      date: startUTCDay
    };

    const doc = await getDocument(options);
    return doc;
  } catch (err) {
    console.log(`Error getLogDocument: ${err.message}`);
    return null;
  }
}

async function getLogCollection(countDay = 7) {
  try {
    const options = { type: TYPE_LOG };
    const startUTCDay = getUTCStartDay();

    options.date = {
      $gte: startUTCDay - countDay * DAY,
      $lt: startUTCDay + DAY
    };

    const docs = await getDocumentList(options);

    // sorting
    docs.sort((a, b) => a.date - b.date);

    return docs;
  } catch (err) {
    console.log(`Error getLogCollection: ${err.message}`);
    return [];
  }
}

async function updateLogStore() {
  try {
    let doc = await getLogDocument();

    if (!doc) {
      const options = {
        type: TYPE_LOG,
        date: getUTCStartDay(),
        map: {}
      };
      doc = await createDocument(options);
    }

    if (!doc) return;
    const updatedCount = {};

    // update log store
    Object.keys(logsMap).forEach((key) => {
      if (!Array.isArray(doc.map[key])) doc.map[key] = [];

      const logsArr = doc.map[key];
      updatedCount[key] = logsMap[key].length;

      if (logsArr.length && logsMap[key].length) {
        const lastItem = logsArr.pop();
        const lastItemSubstr = lastItem && lastItem.split(' | ')[1];

        const firstItem = logsMap[key][0];
        const firstItemSubstr = firstItem && firstItem.split(' | ')[1];

        // remove similar log item
        if (
          firstItemSubstr &&
          lastItemSubstr &&
          firstItemSubstr.substring(0, 10) !== lastItemSubstr.substring(0, 10)
        ) {
          logsArr.push(lastItem);
        }
      }
      logsArr.push(...logsMap[key]);
    });

    await updateDocument(doc);

    // clear runtime logs
    Object.keys(logsMap).forEach((key) => {
      logsMap[key].splice(0, updatedCount[key]);
    });
  } catch (err) {
    console.log(`Error updateLogStore: ${err.message}`);
  }
}

module.exports = {
  getLogs: getAllLogsByWorkerId,
  addLog: addLogMessage
};
