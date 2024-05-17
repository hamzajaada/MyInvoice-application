const express = require("express");
const ModelRouter = express.Router();
const ModelController = require("../Controllers/ModelController");
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

ModelRouter.get( "/", ModelController.getAllModels); 
ModelRouter.get( "/:id", ModelController.getOneModel); 
ModelRouter.post('/add', upload.single('icon'), ModelController.addModel);
ModelRouter.put('/edit/:id',  upload.single('icon'), ModelController.updateModel);
ModelRouter.delete("/remove/:id",ModelController.removeModel);

module.exports = ModelRouter;