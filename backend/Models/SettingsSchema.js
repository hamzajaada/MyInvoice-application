const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SettingsSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'Enterprise', required: true },
  companyName: { type: String },
  companyDescribe: { type: String },
  logo: { type: String },
  currency: { type: String },
  taxRate: { type: Number }
});

const Settings = mongoose.model('Settings', SettingsSchema);

module.exports = Settings;