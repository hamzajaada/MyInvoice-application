const Subscription = require("../Models/SubscriptionSchema");
const nodemailer = require("nodemailer");
const Enterprise = require("../Models/EntrepriseSchema");
const addSubscription = async (req, res) => {
  try {
    const subscriptionData = req.body;
    const subscription = new Subscription(subscriptionData);
    await subscription.save();
    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de l'ajout du subscription");
  }
};

const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find()
      .populate("userId")
      .populate("packId");    
    const organizedSubscriptions = subscriptions.map((sub) => {
      const startDate = new Date(sub.startDate).toLocaleDateString("fr-FR");
      const endDate = new Date(sub.endDate).toLocaleDateString("fr-FR");
      return {
        _id: sub._id,
        enterpriseName: sub.userId ? sub.userId.name : "Utilisateur inconnu",
        enterpriseStatus: sub.userId ? sub.userId.status : "Status inconnu",
        packName: sub.packId ? sub.packId.name : "Pack inconnu",
        packPrice: sub.packId ? sub.packId.price : 0,
        startDate: startDate,
        endDate: endDate,
        price: sub.price,
        status: sub.status,
      };
    });
    res.status(200).json(organizedSubscriptions);
  } catch (error) {
    console.log(error);
    res.status(500).send("Erreur serveur lors de la recherche des abonnements");
  }
};


const getOneSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche de subscription");
  }
};

const updateSubscription = async (req, res) => {
  try {
    console.log(req.body)
    console.log(req.params)
    const subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    console.log(subscription)
    res.status(201).json({success: true,subscription});
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .send("Erreur serveur lors de la mise à jour de subscription");
  }
};

const removeSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findByIdAndDelete(req.params.id);
    res.status(201).json(subscription);
  } catch (error) {
    res
      .status(500)
      .send("Erreur serveur lors de la suppression de subscription");
  }
};

const updateSubscriptionStatus = async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    const subscriptionExp = await subscriptions.filter(
      (sub) => sub.endDate < new Date()
    );
    if(subscriptionExp && (subscriptionExp.length > 0)) {
      subscriptionExp.forEach(async (subscription) => {
        subscription.status = "expired";
        await subscription.save();
        console.log("update");
      });
      console.log("traitement de update status");
    } else {
      console.log("Aucune souscription à notifier");
    }
    
  } catch (error) {
    res
      .status(500)
      .send("Erreur serveur lors de la mise à jour de la souscription");
  }
};

const SubscriptionEnt = async (req, res) => {
  try {
    const subscription = await Subscription.find({ userId: req.params.id });
    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche de subscription");
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "myinvoice06@gmail.com",
    pass: "ekiv afoc wbnb mrep",
  },
});

const EmailSubscriptionStatus = async (req, res) => {
  try {
    // console.log("start");
    const subscriptions = await Subscription.find();
    const tenDaysAfterCurrentDate = new Date();
    await tenDaysAfterCurrentDate.setDate(tenDaysAfterCurrentDate.getDate() + 10);
    // console.log("subscriptions email: ", subscriptions)
    const subscriptionsToNotify = subscriptions.filter((sub) => {
      return (sub.endDate < tenDaysAfterCurrentDate) && (sub.endDate > new Date());
    });

    // console.log("subscriptionsToNotify: ", subscriptionsToNotify);
    if(subscriptionsToNotify && (subscriptionsToNotify.length > 0)) {
      for (const subscription of subscriptionsToNotify) {
        let email;
        try {
          const enterprise = await Enterprise.findById(subscription.userId);
          email = enterprise.email;
          const mailOptions = {
            from: "myinvoice06@gmail.com",
            to: email,
            subject: "Notification d'expiration d'abonnement",
            text: `Votre abonnement arrive à expiration dans moins de 10 jours. Veuillez renouveler votre abonnement pour continuer à bénéficier de nos services.`,
          };
          await transporter.sendMail(mailOptions);
          console.log(`E-mail envoyé à ${email}`);
        } catch (error) {
          console.error("error : ");
          console.error(`Erreur lors de l'envoi de l'e-mail à ${email}:`, error);
        }
      }
    } else {
      console.log("Aucune souscription à notifier");
    }
    
  } catch (error) {
    console.error(
      "Erreur serveur lors de la mise à jour de la souscription:",
      error
    );
  }

    
};

module.exports = {
  addSubscription,
  getAllSubscriptions,
  getOneSubscription,
  updateSubscription,
  removeSubscription,
  updateSubscriptionStatus,
  SubscriptionEnt,
  EmailSubscriptionStatus,
};
