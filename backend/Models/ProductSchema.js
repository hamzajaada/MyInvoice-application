const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'Enterprise', required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  quantity: {type: Number, required: true},
  price: { type: Number, required: true },
  active: { type: Boolean, default: true },
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;