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
    // console.log('start')
    const subscription = await Subscription.find()
      .populate("userId", "name")
      .populate("packId", "name price");
    // console.log("subscription avant : ", subscription);
    const organizedSubscriptions = subscription.map((subscription) => {
      const startDate = new Date(subscription.startDate).toLocaleDateString(
        "fr-FR"
      );
      const endDate = new Date(subscription.endDate).toLocaleDateString(
        "fr-FR"
      );
      return {
        _id: subscription._id,
        enterpriseId: subscription.userId._id,
        enterpriseName: subscription.userId.name,
        packId: subscription.packId._id,
        packName: subscription.packId.name,
        packPrice: subscription.packId.price,
        startDate: startDate,
        endDate: endDate,
        price: subscription.price,
        status: subscription.status,
      };
    });
    res.status(201).json(organizedSubscriptions);
  } catch (error) {
    res
      .status(500)
      .send("Erreur serveur lors de la recherche des subscription");
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
    const subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(201).json(subscription);
  } catch (error) {
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
