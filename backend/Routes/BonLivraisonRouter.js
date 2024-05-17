const express = require("express");
const BonLivraisonRouter = express.Router();
const BonLivraisonController = require("../Controllers/BonLivraisonController");
 
BonLivraisonRouter.get( "/details/:id", BonLivraisonController.prepareBonLivraisonDetails); 
BonLivraisonRouter.get( "/List/:id", BonLivraisonController.getAllBonLivraisons); 
BonLivraisonRouter.get( "/:id", BonLivraisonController.getOneBonLivraison); 
BonLivraisonRouter.post('/add',BonLivraisonController.addBonLivraison);
BonLivraisonRouter.post('/email',BonLivraisonController.sendEmail);
BonLivraisonRouter.put('/edit/:id',BonLivraisonController.updateBonLivraison);
BonLivraisonRouter.delete("/remove/:id",BonLivraisonController.removeBonLivraison);

module.exports = BonLivraisonRouter;