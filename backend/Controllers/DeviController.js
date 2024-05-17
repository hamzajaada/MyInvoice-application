const Devi = require("../Models/DeviModel");
const OverallStat = require ("../Models/OverallStateSchema");
const Client = require  ("../Models/ClientSchema");
const Product = require  ("../Models/ProductSchema");
const Enterprise = require("../Models/EntrepriseSchema");
const nodemailer = require('nodemailer');

const addDevi = async (req, res) => {
  try {
    const devi = new Devi(req.body.devi);
    await devi.save();
    res.status(201).json(devi);
  } catch (error) {
    console.error('err : ', error)
    res.status(500).send("Erreur serveur lors de l'ajout de devi");
  }
};

const getAllDevis = async (req, res) => {
  try {
    const Alldevis = await Devi.find().populate("clientId").limit(50).sort({ createdOn: -1 });
    const devis = Alldevis.filter(devi => devi.userId.toString() === req.params.id);
    res.status(200).json(devis);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const prepareDeviDetails = async (req, res) => {
  try {
    const devi = await Devi.findById(req.params.id)
      .populate('userId', 'name email phone address logo') 
      .populate('clientId', 'name email phone address') 
      .populate({
        path: 'items.productId',
        select: 'name price', 
      });
   
    const formattedDate = formatDate(devi.date);
    const itemsTable = devi.items.map((item) => {
      return {
        productName: item.productId.name,
        quantity: item.quantity,
        price: item.productId.price,
      };
    });
      _id= devi._id;
      deviStatus = devi.status;
      userName = devi.userId.name;
      userEmail = devi.userId.email;
      userPhone = devi.userId.phone;
      userAddress = devi.userId.address;
      userLogo = devi.userId.logo;
      clientName = devi.clientId.name;
      clientEmail = devi.clientId.email;
      clientPhone = devi.clientId.phone;
      clientAddress = devi.clientId.address;
      amount = devi.amount;
      
      res.status(200).json({
        _id,
        deviStatus,
        userName,
        userEmail,
        userPhone,
        userAddress,
        userLogo,
        clientName,
        clientEmail,
        clientPhone,
        clientAddress,
        formattedDate,
        itemsTable,
        amount,
      });
  } catch (error) {
    console.error('Error fetching devi details:', error.message);
    throw error;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.error('Invalid date string:', dateString);
    return '';
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
    res.status(201).json(devi);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la mise à jour de facture");
  }
};

const removeDevi = async (req, res) => {
  try {
    const devi = await Devi.findByIdAndDelete(req.params.id);
    res.status(201).json(devi);
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
  // console.log("Received data:", req.body);
  const { clientEmail, clientName, userName, _id, itemsTable, amount, userPhone, userAddress, userEmail } = req.body;
  console.log("Parsed data:", { clientEmail, clientName, userName, _id, itemsTable, amount, userPhone, userAddress, userEmail });
  const itemsTableHTML = itemsTable.map(item => `<tr><td>${item.productName}</td><td>${item.quantity}</td><td>${item.price.toFixed(2)} DHs</td></tr>`).join('');
  const body = `
  <p>Cher Client(e) Mr/Mme.<strong> ${clientName}</strong>,</br></p>
  <p>Vous avez reçu une devi de l'entreprise <strong><i>${userName}</i></strong>, vérifiez les détails ci-dessous:</br></p>
  <p> - Numéro de devi :<strong> #${_id}</strong></p></br>
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
    to: clientEmail,
    subject: `Devi envoyée depuis ${userName}`,
    html: body,
  }
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' }); 
  } catch (error) {
    console.error('Error sending email:', error.message);
    res.status(500).json({ error: 'Failed to send email' });
  }
};

module.exports = {
  addDevi,
  getAllDevis,
  getOneDevi,
  updateDevi,
  removeDevi,
  prepareDeviDetails,
  sendEmail
};