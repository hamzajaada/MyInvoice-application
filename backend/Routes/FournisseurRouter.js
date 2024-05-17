const express = require("express");
const FournisseurRouter = express.Router();
const FournisseurController = require("../Controllers/FournisseurController");

FournisseurRouter.get( "/Entreprise/:id", FournisseurController.getAllFournisseursEnt); 
FournisseurRouter.get( "/:id", FournisseurController.getOneFournisseur); 
FournisseurRouter.post('/add',FournisseurController.addFournisseur);
FournisseurRouter.put('/edit/:id',FournisseurController.updateFournisseur);
FournisseurRouter.delete("/remove/:id",FournisseurController.removeFournisseur);

module.exports = FournisseurRouter;