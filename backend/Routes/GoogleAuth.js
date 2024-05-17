const express = require("express");
const GoogleAuthRouter = express.Router();
const passport = require("passport");
const GoogleAuthControllers = require('../Controllers/GoogleAuthController')(passport);
const EntrepriseController = require('../Controllers/EntrepriseController')
GoogleAuthRouter.get('/auth/google',
  passport.authenticate('google', { scope: ['profile','email'] }));

GoogleAuthRouter.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: 'http://localhost:3001/Api/auth/google' }),
  async function(req, res) {
    const id = req.user.googleId;
    const user = await EntrepriseController.getEntrepriseByGoogleId({id: id});
    if (user) {
      res.redirect(`http://localhost:3000/login/?userId=${user._id}`);
    } else {
      console.error("Aucune entreprise trouvée pour cet ID Google");
    }
  });

module.exports = GoogleAuthRouter;