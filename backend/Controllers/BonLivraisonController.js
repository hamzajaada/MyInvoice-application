const BonLivraison = require("../Models/BonLivraisonModel");
const Fournisseur = require("../Models/FournisseurSchema");
const Product = require("../Models/ProductSchema");

const addBonLivraison = async (req, res) => {
  try {
    const bonLivraison = new BonLivraison(req.body.bonLivraison);
    await bonLivraison.save();
    res.status(201).json(bonLivraison);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de l'ajout de facture");
  }
};

const getAllBonLivraisons = async (req, res) => {
  try {
    console.log("start");
    const AllbonLivraisons = await BonLivraison.find()
      .populate("bonCommandeId")
      .limit(50)
      .sort({ createdOn: -1 });
    const bonLivraisons = AllbonLivraisons.filter(
      (bonLivraison) => bonLivraison.userId.toString() === req.params.id
    );
    console.log(bonLivraisons);
    res.status(200).json(bonLivraisons);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const prepareBonLivraisonDetails = async (req, res) => {
  try {
    const bonLivraison = await BonLivraison.findById(req.params.id)
      .populate("userId", "name email phone address logo")
      .populate("bonCommandeId");

    const fournisseur = await Fournisseur.findById(
      bonLivraison.bonCommandeId.fournisseurId
    );
    const formattedDateLivraison = formatDate(bonLivraison.dateLivraison);
    // Récupérer les détails des produits en parallèle
    const itemsPromises = bonLivraison.bonCommandeId.items.map(async (item) => {
      const produit = await Product.findById(item.productId);
      return {
        productName: produit.name,
        quantity: item.quantity,
        price: produit.price,
      };
    });

    // Attendre toutes les promesses pour récupérer les détails des produits
    const itemsTable = await Promise.all(itemsPromises);

    const _id = bonLivraison._id;
    const bonLivraisonStatus = bonLivraison.status;
    const userName = bonLivraison.userId.name;
    const userEmail = bonLivraison.userId.email;
    const userPhone = bonLivraison.userId.phone;
    const userAddress = bonLivraison.userId.address;
    const userLogo = bonLivraison.userId.logo;
    const fournisseurName = fournisseur.name;
    const fournisseurEmail = fournisseur.email;
    const fournisseurPhone = fournisseur.phone;
    const fournisseurAddress = fournisseur.address;
    const amount = bonLivraison.amount;

    console.log(
      _id,
      bonLivraisonStatus,
      userName,
      userEmail,
      userPhone,
      userAddress,
      userLogo,
      fournisseurName,
      fournisseurEmail,
      fournisseurPhone,
      fournisseurAddress,
      formattedDateLivraison,
      itemsTable,
      amount
    );
    res.status(200).json({
      _id,
      bonLivraisonStatus,
      userName,
      userEmail,
      userPhone,
      userAddress,
      userLogo,
      fournisseurName,
      fournisseurEmail,
      fournisseurPhone,
      fournisseurAddress,
      formattedDateLivraison,
      itemsTable,
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
    console.log(req)
    const bonLivraison = await BonLivraison.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(201).json(bonLivraison);
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

module.exports = {
  addBonLivraison,
  getAllBonLivraisons,
  getOneBonLivraison,
  updateBonLivraison,
  removeBonLivraison,
  prepareBonLivraisonDetails,
};
