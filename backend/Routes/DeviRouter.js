const express = require("express");
const DeviRouter = express.Router();
const DeviController = require("../Controllers/DeviController");
 
DeviRouter.get( "/details/:id", DeviController.prepareDeviDetails); 
DeviRouter.get( "/List/:id", DeviController.getAllDevis); 
DeviRouter.get( "/:id", DeviController.getOneDevi); 
DeviRouter.post('/add',DeviController.addDevi);
DeviRouter.post('/email',DeviController.sendEmail);
DeviRouter.put('/edit/:id',DeviController.updateDevi);
DeviRouter.delete("/remove/:id",DeviController.removeDevi);

module.exports = DeviRouter;