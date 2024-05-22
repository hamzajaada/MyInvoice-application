const express = require("express");
const EntrepriseRouter = express.Router();
const EntrepriseController = require("../Controllers/EntrepriseController");
const Auth = require("../Middlewares/Auth");
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

EntrepriseRouter.get( "/EntrepriseGoogle/:id", EntrepriseController.getEntrepriseByGoogleId); 
EntrepriseRouter.get( "/entreprisedetail/:id", EntrepriseController.getEntrepriseDetail);
EntrepriseRouter.get('/dashboard', EntrepriseController.getDashboardInfo); 
EntrepriseRouter.get('/EnterpriseStat', EntrepriseController.getEnterpriseCountByMonthAndYear);
EntrepriseRouter.get( "/", EntrepriseController.getAllEntreprises); 
EntrepriseRouter.get( "/:id", EntrepriseController.getOneEntreprise); 
EntrepriseRouter.put('/changePassword/:id', EntrepriseController.changePassword);
EntrepriseRouter.post('/register', upload.single('logo'), EntrepriseController.addEntreprise);
EntrepriseRouter.put('/edit/:id', upload.single('logo'), EntrepriseController.updateEntreprise);
EntrepriseRouter.delete("/remove/:id", EntrepriseController.removeEntreprise);
EntrepriseRouter.post('/login',Auth, EntrepriseController.login);
EntrepriseRouter.post('/ForgoutPass', EntrepriseController.ForgoutPass);
EntrepriseRouter.post('/reset-password/:id/:token', EntrepriseController.ResetPass);
EntrepriseRouter.put('/uploadSignature/:id', upload.single('signature'), EntrepriseController.uploadSignature);

module.exports = EntrepriseRouter;