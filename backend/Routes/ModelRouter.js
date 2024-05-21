const express = require("express");
const ModelRouter = express.Router();
const ModelController = require("../Controllers/ModelController");
const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();
const upload = multer({ storage });

ModelRouter.get( "/", ModelController.getAllModels); 
ModelRouter.get( "/:id", ModelController.getOneModel); 
ModelRouter.post('/add', ModelController.addModel);
ModelRouter.put('/edit/:id',  upload.single('icon'), ModelController.updateModel);
ModelRouter.put('/edit/active/:id', ModelController.updateModelActive);
ModelRouter.delete("/remove/:id",ModelController.removeModel);

module.exports = ModelRouter;