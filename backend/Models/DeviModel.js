const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeviSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'Enterprise', required: true },
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true  },
  date: { type: Date, required: true },
  items: [{
      productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number } 
  }],
  taxes: [
    {
      taxId: {
        type: Schema.Types.ObjectId,
        ref: "Tax",
        required: true,
      }
    }
  ],
  status: { type: String, enum: ["attente d'approbation", 'approuvé', 'rejeté'], default: "attente d'approbation" },
  amount: { type: Number, required: true },
},
{timestamps: true}
);

const Devi = mongoose.model('Devi', DeviSchema);

module.exports = Devi;