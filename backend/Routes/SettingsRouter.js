const express = require("express");
const SettingRouter = express.Router();
const SettingController = require("../Controllers/SettingController");

SettingRouter.get( "/", SettingController.getAllSettings); 
SettingRouter.get( "/:id", SettingController.getOneSetting); 

SettingRouter.post('/add',SettingController.addSetting);
SettingRouter.put('/edit/:id',SettingController.updateSetting);
SettingRouter.delete("/remove/:id",SettingController.removeSetting);

module.exports = SettingRouter;