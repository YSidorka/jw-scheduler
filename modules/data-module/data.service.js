const {
  findMany,
  findOne,
  createOne,
  updateOne,
  deleteOne
} = require('../mongodb-module/mongo.module');

async function getDocumentList(options) {
  const result = await findMany(options);
  return result || [];
}

async function getDocumentById(id) {
  const result = await findOne({ _id: id });
  return result || null;
}

async function getDocumentByType(type) {
  const result = await findOne({ type });
  return result || null;
}

async function createDocument(doc) {
  const { id, ..._doc } = doc;
  const result = await createOne({ _id: id, ..._doc });
  return result || null;
}

async function updateDocument(doc) {
  const { id, ..._doc } = doc;
  const result = await updateOne({ _id: id, ..._doc });
  return result || null;
}

async function deleteDocumentById(id) {
  const result = await deleteOne({ _id: id });
  return result;
}

module.exports = {
  getDocumentList,
  getDocumentById,
  getDocumentByType,
  createDocument,
  updateDocument,
  deleteDocumentById
};
