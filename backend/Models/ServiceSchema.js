const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServiceSchema = new Schema({
  ServiceName: { type: String, required: true }
});

const Service = mongoose.model('Service', ServiceSchema);

module.exports = Service;