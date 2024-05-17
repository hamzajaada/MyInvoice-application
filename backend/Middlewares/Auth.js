const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Entreprise = require("../Models/EntrepriseSchema")

const loginMiddleware = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Entreprise.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    const jsenwebtkn = jwt.sign({ userId: user._id }, "AbdelilahElgallati1230");
    req.token = jsenwebtkn;
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

module.exports = loginMiddleware;
