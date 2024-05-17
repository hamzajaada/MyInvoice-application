const express = require("express");
const BonCommandesRouter = express.Router();
const BonCommandesController = require("../Controllers/BonCommandesController");

// BonCommandesRouter.get( "/dashboard/:id", InvoiceController.getDashboardStats); 
// BonCommandesRouter.get( "/summary", InvoiceController.getSales); 
BonCommandesRouter.get( "/details/:id", BonCommandesController.prepareBonCommandeDetails); 
BonCommandesRouter.get( "/List/:id", BonCommandesController.getAllBonCommandes); 
BonCommandesRouter.get( "/:id", BonCommandesController.getOneBonCommande); 
BonCommandesRouter.post('/add',BonCommandesController.addBonCommande);
BonCommandesRouter.put('/edit/:id',BonCommandesController.updateBonCommande);
BonCommandesRouter.delete("/remove/:id",BonCommandesController.removeBonCommande);

module.exports = BonCommandesRouter;