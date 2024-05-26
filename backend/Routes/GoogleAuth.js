const express = require("express");
const GoogleAuthRouter = express.Router();
const passport = require("passport");
const GoogleAuthControllers = require('../Controllers/GoogleAuthController')(passport);
const EntrepriseController = require('../Controllers/EntrepriseController')
// Démarre le processus d'authentification avec Google ,
GoogleAuthRouter.get('/auth/google',
// Redirige l'utilisateur vers la page de connexion Google.
// vous faites appel à la stratégie Google OAuth 2.0 que vous avez configurée avec Passport
  passport.authenticate('google', { scope: ['profile','email'] }));
// Quand la connexion avec google fait avec succes :
GoogleAuthRouter.get('/auth/google/callback', 
  //After failed login
  passport.authenticate('google',  { failureRedirect: 'http://localhost:3001/Api/auth/google' }),
  // Si l'authentification réussit, recherche l'utilisateur dans la base de données et redirige vers la page de connexion avec l'ID utilisateur en tant que paramètre de requête.
  async function(req, res) { 
    const id = req.user.googleId;
    const user = await EntrepriseController.getEntrepriseByGoogleId({id: id});
    console.log(user)
    if (user) {

      //`/${user.name}/dashboardClient`
      //On rediger vers le login pour capter le user id et le mettre dans le locale storage
      res.redirect(`http://localhost:3000/login/?userId=${user._id}`);
    } else {
      console.error("Aucune entreprise trouvée pour cet ID Google");
    }
  });

module.exports = GoogleAuthRouter;