const Devi = require("../Models/DeviModel");
const Product = require("../Models/ProductSchema");
const nodemailer = require("nodemailer");

const addDevi = async (req, res) => {
  try {
    const devi = new Devi(req.body.devi);
    await devi.save();

    for (const item of devi.items) {
      const prod = await Product.findById(item.productId);
      if (!prod) {
        return res.status(404).json({ success: false, message: "Produit non trouvé" });
      }
      prod.quantity -= item.quantity;
      await Product.findByIdAndUpdate(item.productId, { quantity: prod.quantity });
    }

    res.status(200).json({
      success: true,
      devi,
    });
  } catch (error) {
    console.error("err : ", error);
    res.status(500).send("Erreur serveur lors de l'ajout de devi");
  }
};

const getAllDevis = async (req, res) => {
  try {
    const Alldevis = await Devi.find({ active: true })
      .populate("clientId")
      .limit(50)
      .sort({ createdOn: -1 });
    const devis = Alldevis.filter(
      (devi) => devi.userId.toString() === req.params.id
    );
    res.status(200).json(devis);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const prepareDeviDetails = async (req, res) => {
  try {
    const devi = await Devi.findById(req.params.id)
      .populate("userId", "name email phone address logo signature")
      .populate("clientId", "name email phone address")
      .populate({
        path: "items.productId",
        select: "name price",
      })
      .populate({
        path: "taxes.taxId",
        select: "TaksValleur name",
      });

    const formattedDate = formatDate(devi.date);
    const itemsTable = devi.items.map((item) => {
      return {
        productName: item.productId.name,
        quantity: item.quantity,
        price: item.productId.price,
      };
    });
    const taxesTable = devi.taxes.map((elem) => {
      return {
        taxeName: elem.taxId.name,
        value: elem.taxId.TaksValleur,
      };
    });
    const _id = devi._id;
    const deviStatus = devi.status;
    const userName = devi.userId.name;
    const userEmail = devi.userId.email;
    const userPhone = devi.userId.phone;
    const userAddress = devi.userId.address;
    const userLogo = devi.userId.logo;
    const userSignature = devi.userId.signature;
    const clientName = devi.clientId.name;
    const clientEmail = devi.clientId.email;
    const clientPhone = devi.clientId.phone;
    const clientAddress = devi.clientId.address;
    const amount = devi.amount;

    console.log(userSignature)

    res.status(200).json({
      _id,
      deviStatus,
      userName,
      userEmail,
      userPhone,
      userAddress,
      userLogo,
      userSignature,
      clientName,
      clientEmail,
      clientPhone,
      clientAddress,
      formattedDate,
      itemsTable,
      taxesTable,
      amount,
    });
  } catch (error) {
    console.error("Error fetching devi details:", error.message);
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

const getOneDevi = async (req, res) => {
  try {
    const devi = await Devi.findById(req.params.id);
    res.status(201).json(devi);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche de facture");
  }
};

const updateDevi = async (req, res) => {
  try {
    const devi = await Devi.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      devi,
    });
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la mise à jour de facture");
  }
};

const removeDevi = async (req, res) => {
  try {
    const devi = await Devi.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
    });
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
    clientEmail,
    clientName,
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
      (item) => `
  <tr>
    <td style="border: 1px solid #ddd; padding: 8px;">${item.productName}</td>
    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${
      item.quantity
    }</td>
    <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.price.toFixed(
      2
    )} DHs</td>
  </tr>`
    )
    .join("");

  const body = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <p style="font-size: 16px;">Cher Client(e) Mr/Mme. <strong>${clientName}</strong>,</p>
    <p style="font-size: 16px;">Vous avez reçu une devi de l'entreprise <strong><i>${userName}</i></strong>, vérifiez les détails ci-dessous:</p>
    <p style="font-size: 16px;">- Numéro de devi : <strong>#${_id}</strong></p>
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
      </tbody>
      <tfoot>
        <tr>
          <th colspan="2" style="border: 1px solid #ddd; padding: 8px; text-align: right;">Montant :</th>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: right;"><strong>${amount.toFixed(
            2
          )} DHs</strong></td>
        </tr>
      </tfoot>
    </table>
    <p style="font-size: 16px; margin-top: 20px;">Considérez s'il vous plaît le paiement de votre devi avant le <strong style="color: red;">${formattedDueDate}</strong>.</p>
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
    to: clientEmail,
    subject: `Devi envoyée depuis ${userName}`,
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
  addDevi,
  getAllDevis,
  getOneDevi,
  updateDevi,
  removeDevi,
  prepareDeviDetails,
  sendEmail,
};
