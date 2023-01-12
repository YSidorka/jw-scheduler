const mongoose = require('mongoose');

const { Schema } = mongoose;
const schema = new Schema(
  {
    _id: { type: String }
  },
  {
    collection: 'documents',
    strict: false,
    strictQuery: false
  }
);

module.exports = mongoose.model('DefaultDocument', schema);
