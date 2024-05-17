const express = require("express");
const TaksRouter = express.Router();
const TaksController = require("../Controllers/TaksController");

TaksRouter.get( "/Entreprise/:id", TaksController.getAllTaksEnt); 
TaksRouter.get( "/:id", TaksController.getOneTaks);
TaksRouter.put('/edit/:id',TaksController.updateTaks);
TaksRouter.post('/add',TaksController.addTaks); 
TaksRouter.delete("/remove/:id",TaksController.removeTaks);

module.exports = TaksRouter;