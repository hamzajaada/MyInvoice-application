const express = require("express");
const ServiceRouter = express.Router();
const ServiceController = require("../Controllers/ServiceController");

ServiceRouter.get( "/", ServiceController.getAllservices); 
ServiceRouter.get( "/:id", ServiceController.getOneService); 
ServiceRouter.post('/add',ServiceController.addService);
ServiceRouter.put('/edit/:id',ServiceController.updateService);
ServiceRouter.delete("/remove/:id",ServiceController.removeService);

module.exports = ServiceRouter;