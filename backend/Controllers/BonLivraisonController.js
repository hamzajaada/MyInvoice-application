const BonLivraison = require("../Models/BonLivraisonModel");
const Fournisseur = require("../Models/FournisseurSchema");
const Product = require("../Models/ProductSchema");
const nodemailer = require("nodemailer");
const BonCommande = require("../Models/BonCommandesModel");

const addBonLivraison = async (req, res) => {
  try {
    const bonLivraison = new BonLivraison(req.body.bonLivraison);
    await bonLivraison.save();
    res.status(200).json({
      success: true,
      bonLivraison,
    });
  } catch (error) {
    res.status(500).send("Erreur serveur lors de l'ajout de facture");
  }
};

const getAllBonLivraisons = async (req, res) => {
  try {
    const AllbonLivraisons = await BonLivraison.find({ active: true })
      .populate("bonCommandeId")
      .limit(50)
      .sort({ createdOn: -1 });
    const bonLivraisons = AllbonLivraisons.filter(
      (bonLivraison) => bonLivraison.userId.toString() === req.params.id
    );
    res.status(200).json(bonLivraisons);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const prepareBonLivraisonDetails = async (req, res) => {
  try {
    const bonLivraison = await BonLivraison.findById(req.params.id);
    const bonCommande = await BonCommande.findById(bonLivraison.bonCommandeId)
      .populate("userId")
      .populate("fournisseurId")
      .populate({
        path: "items.productId",
        select: "name price",
      })
      .populate({
        path: "taxes.taxId",
        select: "TaksValleur name",
      });

    const fournisseur = await Fournisseur.findById(
      bonLivraison.bonCommandeId.fournisseurId
    );
    const formattedDateLivraison = formatDate(bonLivraison.dateLivraison);
    const itemsTable = bonCommande.items.map((item) => {
      return {
        productName: item.productId.name,
        quantity: item.quantity,
        price: item.productId.price,
      };
    });

    const taxesTable = bonCommande.taxes.map((elem) => {
      return {
        taxeName: elem.taxId.name,
        value: elem.taxId.TaksValleur,
      };
    });



    const _id = bonLivraison._id;
    const bonLivraisonStatus = bonLivraison.status;
    const userName = bonCommande.userId.name;
    const userEmail = bonCommande.userId.email;
    const userPhone = bonCommande.userId.phone;
    const userAddress = bonCommande.userId.address;
    const userLogo = bonCommande.userId.logo;
    const userSignature = bonCommande.userId.signature;
    const fournisseurName = bonCommande.fournisseurId.name;
    const fournisseurEmail = bonCommande.fournisseurId.email;
    const fournisseurPhone = bonCommande.fournisseurId.phone;
    const fournisseurAddress = bonCommande.fournisseurId.address;
    const amount = bonLivraison.amount;
    res.status(200).json({
      _id,
      bonLivraisonStatus,
      userName,
      userEmail,
      userPhone,
      userAddress,
      userLogo,
      userSignature,
      fournisseurName,
      fournisseurEmail,
      fournisseurPhone,
      fournisseurAddress,
      formattedDateLivraison,
      itemsTable,
      taxesTable,
      amount,
    });
  } catch (error) {
    console.error("Error fetching bonLivraison details:", error.message);
    throw error;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.error("Invalid date string:", dateString);
    return "";
  }
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return date.toLocaleDateString("fr-FR", options);
};

const getOneBonLivraison = async (req, res) => {
  try {
    const bonLivraison = await BonLivraison.findById(req.params.id);
    res.status(201).json(bonLivraison);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche de facture");
  }
};

const updateBonLivraison = async (req, res) => {
  try {
    const bonLivraison = await BonLivraison.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      bonLivraison,
    });
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la mise à jour de facture");
  }
};

const removeBonLivraison = async (req, res) => {
  try {
    const bonLivraison = await BonLivraison.findByIdAndDelete(req.params.id);
    res.status(201).json(bonLivraison);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la suppression de facture");
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "myinvoice06@gmail.com",
    pass: "ekiv afoc wbnb mrep",
  },
});

const sendEmail = async (req, res) => {
  const {
    fournisseurEmail,
    fournisseurName,
    userName,
    _id,
    itemsTable,
    amount,
    formattedDateLivraison,
    userPhone,
    userAddress,
    userEmail,
    taxesTable,
    sousTotale,
  } = req.body;
  const itemsTableHTML = itemsTable
    .map(
      (item) =>
        `<tr><td>${item.productName}</td><td>${
          item.quantity
        }</td><td>${item.price.toFixed(2)} DHs</td></tr>`
    )
    .join("");
    const taxesTableHTML = taxesTable
    .map(
      (tax) => `
  <tr>
    <td  colspan="2" style=" border: 1px solid #ddd; padding: 8px; text-align: center;">${tax.taxeName}</td>
    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${tax.value}%</td>
  </tr>`
    )
    .join("");
  const body = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p style="font-size: 16px;">Cher fournisseu(e) Mr/Mme. <strong>${fournisseurName}</strong>,</p>
      <p style="font-size: 16px;">Vous avez reçu une bon de livraison de l'entreprise <strong><i>${userName}</i></strong>, vérifiez les détails ci-dessous:</p>
      <p style="font-size: 16px;">- Numéro de bon de livraison : <strong>#${_id}</strong></p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Nom du Produit</th>
            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; text-align: center;">Quantité</th>
            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; text-align: right;">Prix</th>
          </tr>
        </thead>
        <tbody>
          ${itemsTableHTML}
          <tr>
          <th colspan="2" style="border: 1px solid #ddd; padding: 8px; text-align: right;">Sous-Total :</th>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>${sousTotale.toFixed(
            2
          )} DHs</strong></td>
        </tr>
          <tr>
          <th colspan="2" style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; text-align: center;">Taxes</th>
          <th colspan="1" style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; text-align: center;">Taux</th>
          </tr>
          ${taxesTableHTML}
        </tbody>
        <tfoot>
          <tr>
            <th colspan="2" style="border: 1px solid #ddd; padding: 8px; text-align: right;">Montant :</th>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>${amount.toFixed(
              2
            )} DHs</strong></td>
          </tr>
        </tfoot>
      </table>
      <p style="font-size: 16px; margin-top: 20px;">Considérez s'il vous plaît que la date de livraison de votre bon de livraison est le <strong style="color: red;">${formattedDateLivraison}</strong>.</p>
      <p style="font-size: 16px;">Si vous avez des questions, vous trouverez ci-dessus les coordonnées de l'entreprise :</p>
      <ul style="font-size: 16px;">
        <li>Téléphone : <strong>${userPhone}</strong></li>
        <li>Adresse : <strong>${userAddress}</strong></li>
        <li>Email : <strong>${userEmail}</strong></li>
      </ul>
      <p style="font-size: 16px;">Cordialement,</p>
      <p style="font-size: 16px;"><strong>MY INVOICE TEAM</strong></p>
    </div>
  `;

  var mailOptions = {
    from: "myinvoice06@gmail.com",
    to: fournisseurEmail,
    subject: `Bon de livraison envoyée depuis ${userName}`,
    html: body,
  };
  try {
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error.message);
    res.status(500).json({ error: "Failed to send email" });
  }
};

module.exports = {
  addBonLivraison,
  getAllBonLivraisons,
  getOneBonLivraison,
  updateBonLivraison,
  removeBonLivraison,
  prepareBonLivraisonDetails,
  sendEmail,
};
