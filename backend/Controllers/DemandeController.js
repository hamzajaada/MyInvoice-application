const Demande = require("../Models/DemandeModel")
const nodemailer = require("nodemailer");
const Enterprise = require('../Models/EntrepriseSchema')
const addDemande = async (req, res) => {
  try {
    const demandeData = req.body;
    const demande = new Demande(demandeData);
    await demande.save();
    res.status(201).json({success: true});
  } catch (error) {
    res.status(500).send("Erreur serveur lors de l'ajout du demande");
  }
}

const  getAllDemandes = async (req, res) => {
  try {
    const  demande = await Demande.find().populate('userId').populate('packId');
    const organizedDemandes = demande.map(demande => {
      return {
        _id: demande._id,
        enterpriseId: demande.userId._id,
        enterpriseName: demande.userId.name,
        enterpriseLogo: demande.userId.logo,
        packId: demande.packId._id,
        packName: demande.packId.name,
        packPrice: demande.packId.price,
        nombreAnnee: demande.nombreAnnee,
        amount: demande.amount,
        status: demande.status,
      };
    });
    res.status(201).json(organizedDemandes);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche des demande");
  }
}

const  getOneDemande = async (req, res) => {
  try {
    const  demande = await Demande.findById(req.params.id);
    res.status(201).json(demande);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche de demande");
  }
}

const  updateDemande = async (req,res)=>{
  try {
    console.log(req.body)
    const  demande = await Demande.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.status(201).json({success: true, demande});
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la mise à jour de demande");
  }
}

const  removeDemande = async (req, res) => {
  try {
    const  demande = await Demande.findByIdAndDelete(req.params.id);
    res.status(201).json(demande);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la suppression de demande");
  }
}

module.exports = {addDemande,getAllDemandes,getOneDemande,updateDemande,removeDemande};