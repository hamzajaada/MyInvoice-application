const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InvoiceSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'Enterprise', required: true },
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  date: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  items: [{
      productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number } 
  }],
  taxes: [
    {
      taxId: {
        type: Schema.Types.ObjectId,
        ref: "Taks",
        required: true,
      }
    }
  ],
  status: { type: String, enum: ['sent', 'paid', 'late'], default: 'sent' },
  amount: { type: Number, required: true },
},
{timestamps: true}
);

const Invoice = mongoose.model('Invoice', InvoiceSchema);

module.exports = Invoice;