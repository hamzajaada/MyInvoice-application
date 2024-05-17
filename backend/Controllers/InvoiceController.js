const Invoice = require("../Models/InvoiceSchema");
const OverallStat = require ("../Models/OverallStateSchema");
const Client = require  ("../Models/ClientSchema");
const Product = require  ("../Models/ProductSchema");
const Enterprise = require("../Models/EntrepriseSchema");
const nodemailer = require('nodemailer');

const addInvoice = async (req, res) => {
  try {
    const InvoiceData = req.body.invoice;
    const invoice = new Invoice(InvoiceData);
    await invoice.save();
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de l'ajout de facture");
  }
};

const getAllInvoices = async (req, res) => {
  try {
    const Allinvoices = await Invoice.find().populate("clientId").limit(50).sort({ createdOn: -1 });
    const invoices = Allinvoices.filter(invoice => invoice.userId.toString() === req.params.id);
    res.status(200).json(invoices);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const prepareInvoiceDetails = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('userId', 'name email phone address logo') 
      .populate('clientId', 'name email phone address') 
      .populate({
        path: 'items.productId',
        select: 'name price', 
      });
   
    const formattedDate = formatDate(invoice.date);
    const formattedDueDate = formatDate(invoice.dueDate);
    const itemsTable = invoice.items.map((item) => {
      return {
        productName: item.productId.name,
        quantity: item.quantity,
        price: item.productId.price,
      };
    });
      invoiceNumber= invoice.invoiceNumber;
      invoiceStatus = invoice.status;
      userName = invoice.userId.name;
      userEmail = invoice.userId.email;
      userPhone = invoice.userId.phone;
      userAddress = invoice.userId.address;
      userLogo = invoice.userId.logo;
      clientName = invoice.clientId.name;
      clientEmail = invoice.clientId.email;
      clientPhone = invoice.clientId.phone;
      clientAddress = invoice.clientId.address;
      amount = invoice.amount;
      
      res.status(200).json({
        invoiceNumber,
        invoiceStatus,
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
        formattedDueDate,
        itemsTable,
        amount,
      });
  } catch (error) {
    console.error('Error fetching invoice details:', error.message);
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


const getSales = async (req, res) => {
  try {
    const overallStats = await OverallStat.find();

    res.status(200).json(overallStats[0]);
  } catch (error) {
    res.status(404).json({ message: error.message });
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
  const { clientEmail, clientName, userName, invoiceNumber, itemsTable, amount, formattedDueDate, userPhone, userAddress, userEmail } = req.body;
  const itemsTableHTML = itemsTable.map(item => `<tr><td>${item.productName}</td><td>${item.quantity}</td><td>${item.price.toFixed(2)} DHs</td></tr>`).join('');
  const body = `
  <p>Cher Client(e) Mr/Mme.<strong> ${clientName}</strong>,</br></p>
  <p>Vous avez reçu une facture de l'entreprise <strong><i>${userName}</i></strong>, vérifiez les détails ci-dessous:</br></p>
  <p> - Numéro de facture :<strong> #${invoiceNumber}</strong></p></br>
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
  <p>Considérez s'il vous plaît le paiement de votre facture avant le <strong>"<font color="red">${formattedDueDate}</font>"</strong>.</p></br>
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
    subject: `Facture envoyée depuis ${userName}`,
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

const getDashboardStats = async (req, res) => {
  try {
    const currentMonth = "Mai";
    const currentYear = 2024;
    const currentDay = "2024-05-05";
    const Allinvoices = await Invoice.find().populate("clientId").limit(50).sort({ createdOn: -1 });
    const invoices = Allinvoices.filter(invoice => invoice.userId.toString() === req.params.id);
    const totalCustomers = await Client.countDocuments({ userId: req.params.id });
    const totalProducts = await Product.countDocuments({ userId: req.params.id });
    const totalInvoices = await Invoice.countDocuments({ userId: req.params.id });
    const totalPaidInvoices = await Invoice.countDocuments({ userId: req.params.id, status: "paid" });
    const totalUnpaidInvoices = await Invoice.countDocuments({
      userId: req.params.id, status: { $nin: ["paid"] },
    });
    const overallStat = await OverallStat.find({ year: currentYear });
    const paidInvoices = await Invoice.find({ userId: req.params.id, status: "paid" });
    const totalPaidAmount = paidInvoices.reduce((total, invoice) => total + invoice.amount, 0);
    const {
      yearlyTotalSoldUnits,
      yearlySalesTotal,
      monthlyData,
      salesByCategory,
    } = overallStat[0];

    const thisMonthStats = overallStat[0].monthlyData.find(({ month }) => {
      return month === currentMonth;
    });

    const todayStats = overallStat[0].dailyData.find(({ date }) => {
      return date === currentDay;
    });
   /* console.log(  invoices,
      totalPaidAmount,
      totalCustomers,
      totalProducts,
      totalInvoices,
      totalPaidInvoices,
      totalUnpaidInvoices,
      yearlyTotalSoldUnits,
      yearlySalesTotal,
      monthlyData,
      salesByCategory,
      thisMonthStats,
      todayStats,);*/
    res.status(200).json({
      invoices,
      totalPaidAmount,
      totalCustomers,
      totalProducts,
      totalInvoices,
      totalPaidInvoices,
      totalUnpaidInvoices,
      yearlyTotalSoldUnits,
      yearlySalesTotal,
      monthlyData,
      salesByCategory,
      thisMonthStats,
      todayStats,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
const getOneInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche de facture");
  }
};

const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la mise à jour de facture");
  }
};

const removeInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la suppression de facture");
  }
};

module.exports = {
  addInvoice,
  getAllInvoices,
  getOneInvoice,
  updateInvoice,
  removeInvoice,
  getSales,
  getDashboardStats,
  prepareInvoiceDetails,
  sendEmail,
};