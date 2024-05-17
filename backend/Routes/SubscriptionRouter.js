const express = require("express");
const SubscriptionRouter = express.Router();
const SubscriptionController = require("../Controllers/SubscriptionController");
 
SubscriptionRouter.get( "/", SubscriptionController.getAllSubscriptions); 
SubscriptionRouter.get( "/:id", SubscriptionController.getOneSubscription); 
SubscriptionRouter.get( "/Entreprise/:id", SubscriptionController.SubscriptionEnt); 
SubscriptionRouter.post('/add',SubscriptionController.addSubscription);
SubscriptionRouter.put('/edit/:id',SubscriptionController.updateSubscription);
SubscriptionRouter.delete("/remove/:id",SubscriptionController.removeSubscription);

module.exports = SubscriptionRouter;