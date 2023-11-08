const { TYPE_ENVIRONMENT } = require('@jw/const');
const uuid = require('uuid');
const {
  findMany,
  findOne,
  createOne,
  updateOne,
  deleteOne
} = require('../mongodb-module/mongo.module');

async function envInit(env) {
  try {
    const result = {};

    const keys = Object.keys(env);
    while (keys.length) {
      const key = keys.pop();
      if (env[key]) {
        const doc = await getDocumentById(`${env[key]}`, TYPE_ENVIRONMENT);
        result[key] = doc?.data || env[key];
      }
    }

    return result;
  } catch (err) {
    console.log('Error: envInit', err.message);
    return null;
  }
}

async function getDocumentList(options) {
  const result = await findMany(options);
  return result || [];
}

async function getDocumentById(id, type) {
  const result = await findOne({ _id: id, type });
  return result || null;
}

async function getDocument(options) {
  const result = await findOne(options);
  return result || null;
}

async function createDocument(doc) {
  const { id, ..._doc } = doc;
  const result = await createOne({ _id: id || uuid.v4(), ..._doc });
  return result || null;
}

async function updateDocument(doc) {
  const { id, ..._doc } = doc;
  const result = await updateOne({ _id: id, ..._doc });
  return result || null;
}

module.exports = {
  envInit,
  getDocumentList,
  getDocumentById,
  getDocument,
  createDocument,
  updateDocument
};
