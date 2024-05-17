const express = require("express");
const PackRouter = express.Router();
const PackController = require("../Controllers/PackController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../Public/Images")); 
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

PackRouter.get( "/ThreePacks", PackController.getThreePacks);
PackRouter.get( "/AllPacksThreeService", PackController.getAllPacksThreeService);
PackRouter.get( "/", PackController.getAllPacks); 
PackRouter.get( "/:id", PackController.getOnePack);
PackRouter.post('/add', upload.single('logo'), PackController.addPack);
PackRouter.put('/edit/:id', upload.single('logo'), PackController.updatePack);
PackRouter.delete("/remove/:id",PackController.removePack);

module.exports = PackRouter;