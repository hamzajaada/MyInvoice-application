const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Enterprise = require("../Models/EntrepriseSchema");
const Subscription = require('../Models/SubscriptionSchema')
module.exports = (passport) => {
    passport.serializeUser(function(user, done) {
        done(null, user.id)
    });
    passport.deserializeUser(function(id, done) {
        Enterprise.findById(id).exec() 
            .then(user => done(null, user))
            .catch(err => done(err));
    });

    passport.use(
        new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3001/Api/auth/google/callback",
            prompt: 'select_account', 
    
        }, async function(accessToken, refreshToken, profile, cb) {
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
