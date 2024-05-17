const Pack = require("../Models/PackSchema");
const Service = require("../Models/ServiceSchema");
const mongoose = require("mongoose");

const addPack = async (req, res) => {
  try {
    const packData = req.body;
    console.log("req : ", req);
    const serviceIds = packData.services.split(",");
    const logo = req.file ? req.file.filename : null;
    const pack = new Pack({
      name: packData.name,
      description: packData.description,
      services: serviceIds.map((serviceId) => ({ serviceId })),
      price: packData.price,
      logo,
    });
    await pack.save();
    res.status(201).json(pack);
  } catch (error) {
    console.log(error);
    res.status(500).send("Erreur serveur lors de l'ajout du pack");
  }
};

const getAllPacks = async (req, res) => {
  try {
    const packs = await Pack.find().populate("services.serviceId");
    res.status(201).json(packs);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche des packs");
  }
};
const getThreePacks = async (req, res) => {
  try {
    const packs = await Pack.find()
      .populate({
        path: "services.serviceId",
        model: "Service",
        select: "ServiceName",
      })
      .limit(3);
    packs.forEach((pack) => {
      pack.services = pack.services.slice(0, 3);
    });
    res.status(200).json(packs);
  } catch (error) {
    console.error("error", error);
    res.status(500).send("Erreur serveur lors de la recherche des packs");
  }
};

const getAllPacksThreeService = async (req, res) => {
  try {
    const packs = await Pack.find().populate({
      path: "services.serviceId",
      model: "Service",
      select: "ServiceName",
    });

    // Limiter le nombre de services pour chaque pack à 3
    packs.forEach((pack) => {
      pack.services = pack.services.slice(0, 3);
    });
    res.status(200).json(packs);
  } catch (error) {
    console.error("error", error);
    res.status(500).send("Erreur serveur lors de la recherche des packs");
  }
};

const getOnePack = async (req, res) => {
  try {
    const pack = await Pack.findById(req.params.id);
    res.status(201).json(pack);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche de pack");
  }
};


const updatePack = async (req, res) => {
  try {
    const logo = req.file ? req.file.filename : null;
    let { name, description, services, price } = req.body;
    services = JSON.parse(services);
    const updatedPackData = {
      name,
      description,
      services,
      price,
    };
    if (logo) {
      updatedPackData.logo = logo;
    }
    const updatedPack = await Pack.findByIdAndUpdate(
      req.params.id,
      updatedPackData,
      { new: true }
    );
    res.status(201).json(updatedPack);
  } catch (error) {
    console.log(error);
    res.status(500).send("Erreur serveur lors de la mise à jour de pack");
  }
};

const removePack = async (req, res) => {
  try {
    const pack = await Pack.findByIdAndDelete(req.params.id);
    res.status(201).json(pack);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la suppression de pack");
  }
};

module.exports = {
  addPack,
  getAllPacks,
  getThreePacks,
  getOnePack,
  updatePack,
  removePack,
  getAllPacksThreeService,
};
