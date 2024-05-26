// Importation de la stratégie Google OAuth 2.0 pour Passport.
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Enterprise = require("../Models/EntrepriseSchema");
const Subscription = require('../Models/SubscriptionSchema')
module.exports = (passport) => {
    // utilisée pour déterminer quelles données de l'utilisateur doivent être stockées dans la session
    passport.serializeUser(function(user, done) {
        //Lorsqu'un utilisateur se connecte, Passport appelle la fonction serializeUser.
        //Cela minimise la quantité de données stockées dans la session, ce qui est plus efficace
        //signifie que seul l'ID de l'utilisateur sera stocké dans la session.
        done(null, user.id)
    });
    // cette fonction pour récupérer les informations de l'utilisateur à partir de l'ID stocké dans la session
    passport.deserializeUser(function(id, done) {
        Enterprise.findById(id).exec() 
            .then(user => done(null, user))
            .catch(err => done(err));
    });

    passport.use(
        new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            // l'URL vers laquelle l'utilisateur sera redirigé après avoir authentifié avec succès via Google
            // C'est à cette URL que Google enverra l'utilisateur avec un code d'autorisation , ainsi que des informations sur le profil de l'utilisateur.
            callbackURL: "http://localhost:3001/Api/auth/google/callback",
            //Spécifie comment l'écran de connexion Google est affiché
            prompt: 'select_account', 
    
        }, // Fonction de rappel exécutée après l'authentification réussie par Google.
        async function(accessToken, refreshToken, profile, cb) {
            console.log(profile);
            try {
                let user = await Enterprise.findOne({ googleId: profile.id });
                if (user) {
                    const updateUser = {
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        logo: profile.photos[0].value,
                        password: accessToken,
                    };
                    await Enterprise.findOneAndUpdate({ googleId: profile.id }, { $set: updateUser }, { new: true });
                    return cb(null, user);
                } else {
                    const newUser = new Enterprise({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        logo: profile.photos[0].value,
                        password: accessToken,
                    }); 
                    await newUser.save();
                    const subscription = new Subscription({
                      userId: newUser._id,
                      packId: '6631005f1c1fec2176ead2cb',
                      startDate: Date.now(),
                      endDate: Date.now() + 1000 * 60 * 60 * 24 * 30, 
                      status: "active",
                      price: 0,
                    })
                    subscription.save()
                    return cb(null, newUser);
                }
            } catch (err) {
                return cb(err, null);
            }
        })
    );
};
