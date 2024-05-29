const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cron = require("node-cron");
const passport = require("passport");
const session = require("express-session");
// const url = "mongodb://127.0.0.1:27017/MyInvoice";
const url = "mongodb+srv://MyInvoice:MyInvoice123Test@myinvoice.id4aqck.mongodb.net/?retryWrites=true&w=majority&appName=MyInvoice"
const bodyParser = require("body-parser");
const app = express();
const Port = 3001;
require('dotenv').config();
const CategorieRouter = require("./Routes/CategoryRouter");
const TaksRouter = require("./Routes/TaksRouter");
const ClientRouter = require("./Routes/ClientRouter");
const EntrepriseRouter = require("./Routes/EntrepriseRouter");
const InvoiceRouter = require("./Routes/InvoiceRouter");
const PackRouter = require("./Routes/PackRouter");
const ProductRouter = require("./Routes/ProductRouter");
const ServiceRouter = require("./Routes/ServiceRouter");
const MessageRouter = require("./Routes/MessageRouter");
const SubscriptionRouter = require("./Routes/SubscriptionRouter");
const ModelRouter = require("./Routes/ModelRouter");
const FournisseurRouter = require('./Routes/FournisseurRouter');
const BonCommandesRouter = require('./Routes/BonCommandesRouter');
const BonLivraisonRouter = require('./Routes/BonLivraisonRouter');
const DeviRouter = require('./Routes/DeviRouter');
const DemandeRouter = require('./Routes/DemandeRouter');
const GoogleAuthRouter = require("./Routes/GoogleAuth");

const {
  updateSubscriptionStatus,
  EmailSubscriptionStatus,
} = require("./Controllers/SubscriptionController");

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("Public"));
app.use(session({   // Utilisation de express-session
  secret: "secret",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use("/Api/Categorie", CategorieRouter);
app.use("/Api/Tax", TaksRouter);
app.use("/Api/Client", ClientRouter);
app.use("/Api/Fournisseur", FournisseurRouter);
app.use("/Api/Entreprise", EntrepriseRouter);
app.use("/Api/Invoice", InvoiceRouter);
app.use("/Api/BonCommandes", BonCommandesRouter);
app.use("/Api/BonLivraison", BonLivraisonRouter);
app.use("/Api/Devi", DeviRouter);
app.use("/Api/Demande", DemandeRouter);
app.use("/Api/Pack", PackRouter);
app.use("/Api/Message", MessageRouter); 
app.use("/Api/Model", ModelRouter);
app.use("/Api/Produit", ProductRouter);
app.use("/Api/Service", ServiceRouter);
app.use("/Api/Subscription", SubscriptionRouter);
app.use("/Api/", GoogleAuthRouter);

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("connecting to my database in port : " + Port);
  })
  .catch((err) => {
    console.log(err);
  });

cron.schedule(
  "34 00 * * *",
  () => {
    updateSubscriptionStatus();
    EmailSubscriptionStatus();
  },
  {
    timezone: "Africa/Casablanca",
  }
);

app.listen(Port, () => {
  
  console.log("the platform is running well");
});
