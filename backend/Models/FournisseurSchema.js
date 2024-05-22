const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FournisseurSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'Enterprise', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  address: { type: String },
  active: { type: Boolean, default: true },
},
{timestamps: true}
);

const Fournisseur = mongoose.model('Fournisseur', FournisseurSchema);

module.exports = Fournisseur;