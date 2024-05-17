const Devi = require("../Models/DeviModel");
const OverallStat = require ("../Models/OverallStateSchema");
const Client = require  ("../Models/ClientSchema");
const Product = require  ("../Models/ProductSchema");
const Enterprise = require("../Models/EntrepriseSchema");

const addDevi = async (req, res) => {
  try {
    console.log('start')    
    // console.log(req.body.devi);
    const devi = new Devi(req.body.devi);
    await devi.save();
    console.log('devi : ', devi)
    res.status(201).json(devi);
  } catch (error) {
    console.error('err : ', error)
    res.status(500).send("Erreur serveur lors de l'ajout de facture");
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
    const formattedDueDate = formatDate(devi.dueDate);
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
        formattedDueDate,
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

module.exports = {
  addDevi,
  getAllDevis,
  getOneDevi,
  updateDevi,
  removeDevi,
  prepareDeviDetails,
};