const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubscriptionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'Enterprise', required: true },
  packId: { type: Schema.Types.ObjectId, ref: 'Pack', required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
});

const Subscription = mongoose.model('Subscription', SubscriptionSchema);

module.exports = Subscription;