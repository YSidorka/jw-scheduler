const mongoose = require('mongoose');

const { SECOND, TYPE_ENVIRONMENT, TYPE_WORKER, TYPE_LOG } = require('sky-constants');
const { sleep } = require('sky-utils');
const { getStore } = require('../configs/env.config');

const EnvironmentSchema = require('./schemas/env.schema');
const WorkerSchema = require('./schemas/worker.schema');
const LogSchema = require('./schemas/log.schema');

let processFlag = false;

function getSchemaByType(type) {
  if (type === TYPE_ENVIRONMENT) return EnvironmentSchema;
  if (type === TYPE_WORKER) return WorkerSchema;
  if (type === TYPE_LOG) return LogSchema;
  return null;
}

async function findMany(options) {
  try {
    await mongooseConnect();
    const schema = getSchemaByType(options?.type);
    if (!schema) throw new Error('Not supported type of documents');

    const docs = await schema.find(options).lean();
    const result = docs.map(({ _id: id, __v, active, type, ...doc }) => ({ id, ...doc }));

    return result;
  } catch (err) {
    console.log(`Error findMany: ${JSON.stringify(options)} -`, err.message);
    return null;
  }
}

async function findOne(options) {
  try {
    await mongooseConnect();
    const schema = getSchemaByType(options?.type);
    if (!schema) throw new Error('Not supported type of documents');

    const result = await schema.findOne(options).lean();
    return result;
  } catch (err) {
    console.log(`Error findOne: ${JSON.stringify(options)} -`, err.message);
    return null;
  }
}

async function createNewOne(doc) {
  try {
    await mongooseConnect();
    const options = {
      validateBeforeSave: true,
      validateModifiedOnly: false
    };

    const schema = getSchemaByType(doc?.type);
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
    await mongooseConnect();
    const options = {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true
    };

    const schema = getSchemaByType(doc?.type);
    if (!schema) throw new Error('Not supported type of documents');

    return await schema.findOneAndUpdate({ _id: doc._id }, doc, options).lean();
  } catch (err) {
    console.log(`Error findOneAndUpdate: _id:${doc._id} -`, err.message);
    return null;
  }
}

async function deleteOne(doc) {
  try {
    await mongooseConnect();
    const result = await EnvironmentSchema.deleteOne({ _id: doc._id });
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

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true
    };

    const DB_URL = getStore().options?.dbUrl;
    const DB_NAME = getStore().options?.dbName;

    console.log(`${DB_URL}${dbName || DB_NAME}`);

    processFlag = true;
    await mongoose?.connect(`${DB_URL}${dbName || DB_NAME}`, options);
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
