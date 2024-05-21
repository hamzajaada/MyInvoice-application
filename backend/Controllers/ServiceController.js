const Service = require("../Models/ServiceSchema")

const addService = async (req, res) => {
  try {
    const ServiceData = req.body;
    const service = new Service(ServiceData);
    await service.save();
    res.status(201).json({success : true, service});
  } catch (error) {
    res.status(500).json({success: false, message: "Erreur serveur lors de l'ajout du service", error});
  }
}

const  getAllservices = async (req, res) => {
  try {
    const  services = await Service.find({active:true});
    res.status(201).json(services);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche des services");
  }
}

const  getOneService = async (req, res) => {
  try {
    const  service = await Service.findById(req.params.id);
    res.status(201).json(service);
  } catch (error) {
    res.status(201).json({success : false, error});
  }
}

const  updateService = async (req,res)=>{
  try {
    
    const  service = await Service.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.status(201).json({success : true, service});
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la mise à jour de service");
  }
}

const  removeService = async (req, res) => {
  try {
    const  service = await Service.findByIdAndDelete(req.params.id);
    res.status(201).json({success : true});
  } catch (error) {
    res.status(201).json({success : false, error});
  }
}

module.exports = {addService,getAllservices,getOneService,updateService,removeService};