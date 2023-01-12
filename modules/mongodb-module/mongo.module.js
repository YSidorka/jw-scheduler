const mongoose = require('mongoose');

const { getStore } = require('../configs/env.config');
const { SECOND, TYPE_ENVIRONMENT } = require('../../common/constants');
const { sleep } = require('../../common/utils');

const DefaultDocumentSchema = require('./schemas/_document.schema');
const EnvironmentSchema = require('./schemas/env.schema');

let processFlag = false;

function getSchemaByType(type) {
  if (type === TYPE_ENVIRONMENT) return EnvironmentSchema;
  return null;
}

async function findMany(options) {
  try {
    await mongooseConnect();
    const result = await DefaultDocumentSchema.find(options).lean();
    return result;
  } catch (err) {
    console.log(`Error findMany: ${JSON.stringify(options)} -`, err.message);
    return null;
  }
}

async function findOne(options) {
  try {
    await mongooseConnect();
    return await DefaultDocumentSchema.findOne(options).lean();
  } catch (err) {
    console.log(`Error findOne: ${JSON.stringify(options)} -`, err.message);
    return null;
  }
}

async function createNewOne(doc) {
  try {
    const { type } = doc;
    await mongooseConnect();

    const options = {
      validateBeforeSave: true,
      validateModifiedOnly: false
    };

    const schema = getSchemaByType(type);
    if (!schema) throw new Error('Not supported type of documents');

    const result = await schema.create([doc], options);
    return await schema.findOne({ _id: result[0]._id }).lean();
  } catch (err) {
    console.log(`Error createNewOne: _id:${JSON.stringify(doc)} -`, err.message);
    return null;
  }
}

async function findOneAndUpdate(doc) {
  try {
    const { type } = doc;
    await mongooseConnect();

    const options = {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true
    };

    const schema = getSchemaByType(type);
    if (!schema) throw new Error('Not supported type of documents');
    return await schema.findOneAndUpdate({ _id: doc._id }, doc, options);
  } catch (err) {
    console.log(`Error findOneAndUpdate: _id:${doc._id} -`, err.message);
    return null;
  }
}

async function deleteOne(doc) {
  try {
    await mongooseConnect();
    const result = await DefaultDocumentSchema.deleteOne({ _id: doc._id });
    return result.deletedCount > 0;
  } catch (err) {
    console.log(`Error deleteOne: _id:${doc._id} -`, err.message);
    return null;
  }
}

// singleton
async function mongooseConnect(dbName) {
  try {
    while (processFlag) {
      console.log(`sleeping...`);
      await sleep(SECOND);
    }
    if (mongoose?.connection && mongoose?.connection.readyState === 1) return true;

    const DB_URL = getStore().options?.dbUrl;
    const DB_NAME = getStore().options?.dbName;

    processFlag = true;
    await mongoose?.connect(`${DB_URL}${dbName || DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    processFlag = false;

    console.log(`Database connected...`);
    return true;
  } catch (err) {
    processFlag = false;
    console.log(err);
    throw err;
  }
}

module.exports = {
  findMany,
  findOne,
  createOne: createNewOne,
  updateOne: findOneAndUpdate,
  deleteOne
};
