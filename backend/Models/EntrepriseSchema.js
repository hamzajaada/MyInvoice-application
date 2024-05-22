const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EnterpriseSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String,  },
    role: { type: String, default: 'standart'},
    subscription: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
    phone: { type: String },
    address: { type: String},
    logo: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    status: { type: String, enum: ['active', 'cancelled'], default: 'active' },
    googleId : String,
<<<<<<< HEAD
    signature: { type: String },
    // secret : String,
=======
>>>>>>> 1e46a688aeb50c9a724d2774fea52e0ff1c8ca95
  },
  {timestamps: true}
);

const Enterprise = mongoose.model('Enterprise', EnterpriseSchema);

module.exports = Enterprise;