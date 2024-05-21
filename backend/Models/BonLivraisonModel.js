const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BonLivraisonSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Enterprise", required: true },
    bonCommandeId: {
      type: Schema.Types.ObjectId,
      ref: "BonCommande",
      required: true,
    },
    dateLivraison: { type: Date, required: true },
    status: {
      type: String,
      enum: ["attent de confirmation", "confirmé", "attent de reception"],
      default: "attent de confirmation",
    },
    amount: { type: Number, required: true }, 
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const BonLivraison = mongoose.model("BonLivraison", BonLivraisonSchema);

module.exports = BonLivraison;
