const express = require("express");
const ProduitRouter = express.Router();
const ProduitController = require("../Controllers/ProductController");

ProduitRouter.get( "/:id", ProduitController.getOneProduit); 
ProduitRouter.get( "/Entreprise/:id", ProduitController.getAllProduitsEnt); 

ProduitRouter.post('/add',ProduitController.addProduit);
ProduitRouter.put('/edit/:id',ProduitController.updateProduit);
ProduitRouter.delete("/remove/:id",ProduitController.removeProduit);

module.exports = ProduitRouter;