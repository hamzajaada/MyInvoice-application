const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModelSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'Enterprise', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  active: { type: Boolean, default: true },
});

const Model = mongoose.model('Model', ModelSchema);
module.exports = Model;
