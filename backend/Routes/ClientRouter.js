const express = require("express");
const ClientRouter = express.Router();
const ClientController = require("../Controllers/ClientController");

ClientRouter.get( "/Entreprise/:id", ClientController.getAllClientsEnt); 
ClientRouter.get( "/:id", ClientController.getOneClient); 
ClientRouter.post('/add',ClientController.addClient);
ClientRouter.put('/edit/:id',ClientController.updateClient);
ClientRouter.delete("/remove/:id",ClientController.removeClient);

module.exports = ClientRouter;