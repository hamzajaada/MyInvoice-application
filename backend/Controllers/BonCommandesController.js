const BonCommande = require("../Models/BonCommandesModel");
const Fournisseur = require("../Models/FournisseurSchema");
const Product = require("../Models/ProductSchema");
const nodemailer = require("nodemailer");

const addBonCommande = async (req, res) => {
  try {
    const bonCommandeData = req.body.bonCommande;
    const bonCommande = new BonCommande(bonCommandeData);
    await bonCommande.save();

    for (const item of bonCommande.items) {
      const prod = await Product.findById(item.productId);
      if (!prod) {
        return res
          .status(404)
          .json({ success: false, message: "Produit non trouvé" });
      }
      prod.quantity += item.quantity;
      await Product.findByIdAndUpdate(item.productId, {
        quantity: prod.quantity,
      });
    }

    res.status(200).json({
      success: true,
      bonCommande,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur serveur lors de l'ajout de bon de commande");
  }
};

const getAllBonCommandes = async (req, res) => {
  try {
    const AllbonCommandes = await BonCommande.find({ active: true })
      .populate("fournisseurId")
      .limit(50)
      .sort({ createdOn: -1 });
    const bonCommandes = AllbonCommandes.filter(
      (bonCommande) => bonCommande.userId.toString() === req.params.id
    );
    res.status(200).json(bonCommandes);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const prepareBonCommandeDetails = async (req, res) => {
  try {
    const bonCommande = await BonCommande.findById(req.params.id)
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

    if (!bonCommande) {
      return res.status(404).json({ error: "BonCommande not found" });
    }
    const formattedDate = formatDate(bonCommande.date);
    const formattedDueDate = formatDate(bonCommande.dueDate);
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
    const _id = bonCommande._id;
    const bonCommandeStatus = bonCommande.status;
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
    const amount = bonCommande.amount;
    res.status(200).json({
      _id,
      bonCommandeStatus,
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
      formattedDate,
      formattedDueDate,
      itemsTable,
      taxesTable,
      amount,
    });
  } catch (error) {
    console.error("Error fetching bonCommande details:", error.message);
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

const getOneBonCommande = async (req, res) => {
  try {
    const bonCommande = await BonCommande.findById(req.params.id);
    res.status(201).json(bonCommande);
  } catch (error) {
    res
      .status(500)
      .send("Erreur serveur lors de la recherche de bon de commande");
  }
};

const updateBonCommande = async (req, res) => {
  try {
    console.log(req.body);
    const bonCommande = await BonCommande.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(201).json({ success: true, bonCommande });
  } catch (error) {
    res
      .status(500)
      .send("Erreur serveur lors de la mise à jour de bon de commande");
  }
};

const removeBonCommande = async (req, res) => {
  try {
    const bonCommande = await BonCommande.findByIdAndDelete(req.params.id);
    res.status(201).json(bonCommande);
  } catch (error) {
    res
      .status(500)
      .send("Erreur serveur lors de la suppression de bon de commande");
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
    formattedDueDate,
    userPhone,
    userAddress,
    userEmail,
    taxesTable,
    sousTotale,
  } = req.body;
  const itemsTableHTML = itemsTable
    .map(
      (item) =>
        `<tr>
      <td style="border: 1px solid #ddd; padding: 8px;">${item.productName}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${item.quantity}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.price.toFixed(
          2
        )} DHs
        </td>
        </tr>`
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
      <p style="font-size: 16px;">Vous avez reçu une bon de commande de l'entreprise <strong><i>${userName}</i></strong>, vérifiez les détails ci-dessous:</p>
      <p style="font-size: 16px;">- Numéro de bon de commande : <strong>#${_id}</strong></p>
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
      <p style="font-size: 16px; margin-top: 20px;">Considérez s'il vous plaît le paiement de votre bon de commande avant le <strong style="color: red;">${formattedDueDate}</strong>.</p>
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
    subject: `Bon de commande envoyée depuis ${userName}`,
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
  addBonCommande,
  getAllBonCommandes,
  getOneBonCommande,
  updateBonCommande,
  removeBonCommande,
  prepareBonCommandeDetails,
  sendEmail,
};
