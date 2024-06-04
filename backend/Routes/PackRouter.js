const express = require("express");
const PackRouter = express.Router();
const PackController = require("../Controllers/PackController");
const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();
const upload = multer({ storage });

PackRouter.get( "/ThreePacks", PackController.getThreePacks);
PackRouter.get( "/AllPacksThreeService", PackController.getAllPacksThreeService);
PackRouter.get( "/", PackController.getAllPacks); 
PackRouter.get( "/:id", PackController.getOnePack);
PackRouter.get( "/detail/:id", PackController.getPack);
PackRouter.post('/add', PackController.addPack);
PackRouter.put('/edit/:id', upload.single('logo'), PackController.updatePack);
PackRouter.put('/edit/active/:id', PackController.updatePackActive);
PackRouter.delete("/remove/:id",PackController.removePack);

module.exports = PackRouter;