const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServiceSchema = new Schema({
  ServiceName: { type: String, required: true },
  active: { type: Boolean, default: true },
});

const Service = mongoose.model('Service', ServiceSchema);

module.exports = Service;