const BonCommande = require("../Models/BonCommandesModel");
const OverallStat = require("../Models/OverallStateSchema");
const Fournisseur = require("../Models/FournisseurSchema");
const Product = require("../Models/ProductSchema");
const Enterprise = require("../Models/EntrepriseSchema");
const nodemailer = require("nodemailer");

const addBonCommande = async (req, res) => {
  try {
    const bonCommandeData = req.body.bonCommande;
    const bonCommande = new BonCommande(bonCommandeData);
    await bonCommande.save();
    res.status(201).json(bonCommande);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de l'ajout de bon de commande");
  }
};

const getAllBonCommandes = async (req, res) => {
  try {
    const AllbonCommandes = await BonCommande.find()
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
    const _id = bonCommande._id;
    const bonCommandeStatus = bonCommande.status;
    const userName = bonCommande.userId.name;
    const userEmail = bonCommande.userId.email;
    const userPhone = bonCommande.userId.phone;
    const userAddress = bonCommande.userId.address;
    const userLogo = bonCommande.userId.logo;
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
      fournisseurName,
      fournisseurEmail,
      fournisseurPhone,
      fournisseurAddress,
      formattedDate,
      formattedDueDate,
      itemsTable,
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
    res.status(500).send("Erreur serveur lors de la recherche de facture");
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
    res.status(201).json(bonCommande);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la mise à jour de facture");
  }
};

const removeBonCommande = async (req, res) => {
  try {
    const bonCommande = await BonCommande.findByIdAndDelete(req.params.id);
    res.status(201).json(bonCommande);
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
    formattedDueDate,
    userPhone,
    userAddress,
    userEmail,
  } = req.body;
  const itemsTableHTML = itemsTable
    .map(
      (item) =>
        `<tr><td>${item.productName}</td><td>${
          item.quantity
        }</td><td>${item.price.toFixed(2)} DHs</td></tr>`
    )
    .join("");
  const body = `
  <p>Cher Client(e) Mr/Mme.<strong> ${fournisseurName}</strong>,</br></p>
  <p>Vous avez reçu une bon de commande de l'entreprise <strong><i>${userName}</i></strong>, vérifiez les détails ci-dessous:</br></p>
  <p> - Numéro de bon de commande :<strong> #${_id}</strong></p></br>
  <table border="1" cellspacing="0" cellpadding="5">
    <thead>
      <tr>
        <th><strong>Nom du Produit</strong></th>
        <th><strong>Quantité</strong></th>
        <th><strong>Prix</strong></th>
      </tr>
    </thead>
    <tbody>
      ${itemsTableHTML}
    </tbody>
    <tfoot>
      <tr>
        <th><strong>Montant : </strong></th>
        <td colspan="2"> <strong>${amount.toFixed(2)} DHs</strong> </td>
      </tr>
    </tfoot>
  </table>
  </br>
  <p>Considérez s'il vous plaît le paiement de votre bon de commande avant le <strong>"<font color="red">${formattedDueDate}</font>"</strong>.</p></br>
  <p>Si vous avez des questions, vous trouverez ci-dessus les coordonnées de l'entreprise :</p></br>
  <ul>
    <li> Téléphone :<strong> ${userPhone}</strong></li>
    <li> Adresse :<strong> ${userAddress}</strong></li>
    <li> Email :<strong> ${userEmail}</strong></li>
  </ul></br>
  <p>Cordialement,</p></br>
  <p><strong>MY INVOICE TEAM</strong></p>
`;
  var mailOptions = {
    from: "myinvoice06@gmail.com",
    to: fournisseurEmail,
    subject: `Facture envoyée depuis ${userName}`,
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
