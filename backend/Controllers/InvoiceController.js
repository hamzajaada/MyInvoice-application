const Invoice = require("../Models/InvoiceSchema");
const OverallStat = require ("../Models/OverallStateSchema");
const Client = require  ("../Models/ClientSchema");
const Product = require  ("../Models/ProductSchema");
const nodemailer = require('nodemailer');
const { startOfMonth, endOfMonth } = require('date-fns');

const addInvoice = async (req, res) => {
  try {
    const InvoiceData = req.body.invoice;
    const invoice = new Invoice(InvoiceData);
    await invoice.save();
    res.status(200).json({
      success: true,
      invoice,
    });
  } catch (error) {
    res.status(500).send("Erreur serveur lors de l'ajout de facture");
  }
};

const getAllInvoices = async (req, res) => {
  try {
    const Allinvoices = await Invoice.find({active:true}).populate("clientId").limit(50).sort({ createdOn: -1 });
    const invoices = Allinvoices.filter(invoice => invoice.userId.toString() === req.params.id);
    res.status(200).json(invoices);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const prepareInvoiceDetails = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('userId', 'name email phone address logo signature') 
      .populate('clientId', 'name email phone address') 
      .populate({
        path: 'items.productId',
        select: 'name price', 
      })
      .populate({
        path: 'taxes.taxId',
        select: 'TaksValleur name', 
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
    const taxesTable = invoice.taxes.map((elem) => {
      return {
        taxeName: elem.taxId.name,
        value: elem.taxId.TaksValleur,
      };
    });
      _id= invoice._id;
      invoiceStatus = invoice.status;
      userName = invoice.userId.name;
      userEmail = invoice.userId.email;
      userPhone = invoice.userId.phone;
      userAddress = invoice.userId.address;
      userLogo = invoice.userId.logo;
      userSignature = invoice.userId.signature;
      clientName = invoice.clientId.name;
      clientEmail = invoice.clientId.email;
      clientPhone = invoice.clientId.phone;
      clientAddress = invoice.clientId.address;
      amount = invoice.amount;
      
      res.status(200).json({
        _id,
        invoiceStatus,
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
        formattedDueDate,
        itemsTable,
        taxesTable,
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
    
    const invoices = await Invoice.find({ userId: req.params.id, status: "paid", active:true }); 

    const monthlyData = {};
    const dailyData = {};

    invoices.forEach(invoice => {
      const month = invoice.date.toLocaleString('default', { month: 'long' });
      const day = invoice.date.toISOString().split('T')[0];

      if (!monthlyData[month]) {
        monthlyData[month] = { month, totalSales: 0, totalUnits: 0 };
      }

      if (!dailyData[day]) {
        dailyData[day] = { date: day, totalSales: 0, totalUnits: 0 };
      }

      monthlyData[month].totalSales += invoice.amount;
      dailyData[day].totalSales += invoice.amount;

      invoice.items.forEach(item => {
        monthlyData[month].totalUnits += item.quantity;
        dailyData[day].totalUnits += item.quantity;
      });
    });

    res.status(200).json({
      monthlyData: Object.values(monthlyData),
      dailyData: Object.values(dailyData),
    });
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
  const { clientEmail, clientName, userName, _id, itemsTable, amount, formattedDueDate, userPhone, userAddress, userEmail } = req.body;

  const itemsTableHTML = itemsTable.map(item => `
  <tr>
    <td style="border: 1px solid #ddd; padding: 8px;">${item.productName}</td>
    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.quantity}</td>
    <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.price.toFixed(2)} DHs</td>
  </tr>`).join('');

  const body = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <p style="font-size: 16px;">Cher Client(e) Mr/Mme. <strong>${clientName}</strong>,</p>
    <p style="font-size: 16px;">Vous avez reçu une facture de l'entreprise <strong><i>${userName}</i></strong>, vérifiez les détails ci-dessous:</p>
    <p style="font-size: 16px;">- Numéro de facture : <strong>#${_id}</strong></p>
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
          <td style="border: 1px solid #ddd; padding: 8px; text-align: right;"><strong>${amount.toFixed(2)} DHs</strong></td>
        </tr>
      </tfoot>
    </table>
    <p style="font-size: 16px; margin-top: 20px;">Considérez s'il vous plaît le paiement de votre facture avant le <strong style="color: red;">${formattedDueDate}</strong>.</p>
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

    const Allinvoices = await Invoice.find({active : true}).populate("clientId").limit(50).sort({ createdOn: -1 });
    const invoices = Allinvoices.filter(invoice => invoice.userId.toString() === req.params.id);
    const totalCustomers = await Client.countDocuments({ userId: req.params.id , active : true });
    const totalProducts = await Product.countDocuments({ userId: req.params.id , active : true });
    const totalInvoices = await Invoice.countDocuments({ userId: req.params.id , active : true});
    const totalPaidInvoices = await Invoice.countDocuments({ userId: req.params.id, status: "paid" , active : true });
    const totalUnpaidInvoices = await Invoice.countDocuments({
      userId: req.params.id, status: { $nin: ["paid"] }, active : true,
    });
    const paidInvoices = await Invoice.find({ userId: req.params.id, status: "paid", active : true});
    const totalPaidAmount = paidInvoices.reduce((total, invoice) => total + invoice.amount, 0);


    res.status(200).json({
      invoices,
      totalPaidAmount,
      totalCustomers,
      totalProducts,
      totalInvoices,
      totalPaidInvoices,
      totalUnpaidInvoices,
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
    res.status(200).json({
      success: true,
      invoice,
    });
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la mise à jour de facture");
  }
};

const removeInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true
    });
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