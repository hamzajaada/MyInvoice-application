const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModelSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: {type: String, required: true},
});

const Model = mongoose.model('Model', ModelSchema);
module.exports = Model;
