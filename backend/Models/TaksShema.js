const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaksShema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'Enterprise', required: true },
  TaksValleur: { type: Number, required: true },
  name: { type: String, required: true },
});

const Taks = mongoose.model('Taks', TaksShema);

module.exports = Taks; 