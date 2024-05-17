const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'Enterprise', required: true },
  categoryName: { type: String, required: true }
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category; 