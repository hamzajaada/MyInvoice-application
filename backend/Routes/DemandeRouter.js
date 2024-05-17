const express = require("express");
const DemandeRouter = express.Router();
const DemandeController = require("../Controllers/DemandeController");
 
DemandeRouter.get( "/", DemandeController.getAllDemandes); 
DemandeRouter.get( "/:id", DemandeController.getOneDemande); 
DemandeRouter.post('/add',DemandeController.addDemande);
DemandeRouter.put('/edit/:id',DemandeController.updateDemande);
DemandeRouter.delete("/remove/:id",DemandeController.removeDemande);

module.exports = DemandeRouter;