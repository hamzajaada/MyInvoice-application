const Fournisseur = require("../Models/FournisseurSchema");

const addFournisseur = async (req, res) => {
  try {
    const fournisseurData = req.body.fournisseur;
    const fournisseur = new Fournisseur(fournisseurData);
    await fournisseur.save();
    res.status(200).json({
      success: true,
      fournisseur,
    });
  } catch (error) {
    res.status(500).send("Erreur serveur lors de l'ajout du fournisseur");
  }
};

const getAllFournisseursEnt = async (req, res) => {
  try {
    const Allfournisseurs = await Fournisseur.find({active:true});
    const fournisseurs = Allfournisseurs.filter(
      (fournisseur) => fournisseur.userId.toString() === req.params.id
    );
    res.status(200).json(fournisseurs);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getOneFournisseur = async (req, res) => {
  try {
    const fournisseur = await Fournisseur.findById(req.params.id);
    res.status(201).json(fournisseur);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche de fournisseur");
  }
};

const updateFournisseur = async (req, res) => {
  try {
    const fournisseur = await Fournisseur.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.status(200).json({
      success: true,
      fournisseur,
    });
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la mise à jour de fournisseur");
  }
};

const removeFournisseur = async (req, res) => {
  try {
    const fournisseur = await Fournisseur.findByIdAndDelete(req.params.id);
    res.status(201).json(fournisseur);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la suppression de fournisseur");
  }
};

module.exports = {
  addFournisseur,
  getAllFournisseursEnt,
  getOneFournisseur,
  updateFournisseur,
  removeFournisseur,
};
