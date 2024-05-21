const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DemandeSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Enterprise", required: true },
    packId: { type: Schema.Types.ObjectId, ref: "Pack", required: true },
    nombreAnnee: { type: String },
    status: {
      type: String,
      enum: ["en attent", "accepter", "rejeter"],
      default: "en attent",
    },
    amount: { type: Number, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Demande = mongoose.model("Demande", DemandeSchema);

module.exports = Demande;
