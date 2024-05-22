const Entreprise = require("../Models/EntrepriseSchema");
const Subscription = require("../Models/SubscriptionSchema");
const Invoice = require("../Models/InvoiceSchema");
const Pack = require('../Models/PackSchema')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer')
const cloudinary = require("../Utils/cloudinary")

const addEntreprise = async (req, res) => {
  try {
    const { name, email, password, phone, logo, address } = req.body;
    const existeEntreprise = await Entreprise.findOne({ email: email });
    if (!existeEntreprise) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await cloudinary.uploader.upload(logo, {
        folder: "Entreprises",
      });
      const entreprise = new Entreprise({
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        logo: {
          public_id: result.public_id,
          url: result.secure_url,
        },
      });
      await entreprise.save();
      const pack = await Pack.findOne({ name: "Pack Standard" });
      if (pack) {
        const subscription = new Subscription({
          userId: entreprise._id,
          packId: pack._id,
          startDate: Date.now(),
          endDate: Date.now() + 1000 * 60 * 60 * 24 * 30, // 30 days
          status: "active",
          price: 0,
        });
        await subscription.save();
        return res.status(201).json({ success: true, entreprise });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Le pack n'existe pas" });
      }
    } else {
      return res
        .status(400)
        .json({ success: false, message: "L'entreprise existe déjà" });
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'entreprise :", error);
    return res.status(500).json({
      success: false,
      message: `Erreur serveur lors de l'ajout d'entreprise : ${error}`,
      error,
    });
  }
};

const getAllEntreprises = async (req, res) => {
  try {
    const entreprises = await Entreprise.find();
    res.status(201).json(entreprises);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche d'entreprise");
  }
};

const getOneEntreprise = async (req, res) => {
  try {
    const entreprise = await Entreprise.findById(req.params.id);
    res.status(201).json(entreprise);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche d'entreprise");
  }
};

const getEntrepriseByGoogleId = async (req, res) => {
  try {
    const entreprise = await Entreprise.findOne({googleId: req.id});
    return entreprise;
  } catch (error) {
    console.error("Erreur serveur lors de la recherche d'entreprise");
  }
};

const getEntrepriseDetail = async (req, res) => {
  try {
    const entreprise = await Entreprise.findById(req.params.id);
    const subscriptions = await Subscription.find();
    const filteredSubscriptions = subscriptions.find(subscription => subscription.userId.toString() === entreprise._id.toString());
    const packEntreprise = await Pack.find();
    const filteredpackEntreprise = packEntreprise.find(pack => {
      return filteredSubscriptions && filteredSubscriptions.packId.toString() === pack._id.toString();
    });
    const startDate = new Date(filteredSubscriptions.startDate).toLocaleDateString('fr-FR');
    const endDate = new Date(filteredSubscriptions.endDate).toLocaleDateString('fr-FR');
    const entrepriseDetail = {
      _id : entreprise._id,
      name : entreprise.name,
      email : entreprise.email,
      phone : entreprise.phone,
      address : entreprise.address,
      logo : entreprise.logo,
      signature : entreprise.signature,
      subscriptionStatue : filteredSubscriptions.status,
      subscriptionStartDate : startDate,
      subscriptionEndDate : endDate,
      pack : filteredpackEntreprise.name,
      packId: filteredpackEntreprise._id,
      price : filteredpackEntreprise.price,
    };
    res.status(200).json(entrepriseDetail);
  } catch (error) {
    console.error("Error occurred: ", error);
    res.status(500).send("Erreur serveur lors de la recherche d'entreprise");
  }
};

const uploadSignature = async (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    const enterprise = await Entreprise.findById(id);
    if (!enterprise) {
      return res.status(404).json({ message: 'Enterprise not found.' });
    }

    enterprise.signature = req.file.filename;
    await enterprise.save();

    res.status(200).json({ message: 'Signature uploaded successfully.', signature: req.file.filename });
  } catch (error) {
    console.error('Error uploading signature:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const updateEntreprise = async (req, res) => {
  try {
    const currentEntreprise = await Entreprise.findById(req.params.id);
    const data = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
    };

    if (req.file) {
      const ImgId = currentEntreprise.logo.public_id;
      if (ImgId) {
        await cloudinary.uploader.destroy(ImgId);
      }

      const result = await cloudinary.uploader
        .upload_stream(
          {
            folder: "Entreprises",
          },
          async (error, result) => {
            if (error) {
              console.error(error);
              res.status(500).send({
                success: false,
                message: "Erreur serveur lors de la mise à jour d'entreprise",
                error,
              });
            } else {
              data.logo = {
                public_id: result.public_id,
                url: result.secure_url,
              };

              const entreprise = await Entreprise.findByIdAndUpdate(
                req.params.id,
                data,
                {
                  new: true,
                }
              );
              res.status(200).json({
                success: true,
                entreprise,
              });
            }
          }
        )
        .end(req.file.buffer);
    } else {
      const entreprise = await Entreprise.findByIdAndUpdate(
        req.params.id,
        data,
        {
          new: true,
        }
      );
      res.status(200).json({
        success: true,
        entreprise,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la mise à jour d'entreprise",
      error,
    });
  }
};

const removeEntreprise = async (req, res) => {
  try {
    const entreprise = await Entreprise.findByIdAndDelete(req.params.id);
    res.status(201).json(entreprise);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la suppression d'entreprise");
  }
};


const login = async (req, res) => {
  try {
    const jsenwebtkn = req.token;
    const user = req.user;
    //erreur : 
    const sub = await Subscription.findOne({userId: user._id});
    const pack = await Pack.findById(sub.packId);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    res.json({ jsenwebtkn, user, pack  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
  console.log("sortie dans la fonction login");
};

const getDashboardInfo = async (req, res) => {
  try {
    const totalEntreprises = await Entreprise.countDocuments();
    const revenueBySubscription = await Subscription.aggregate([
      { $group: { _id: "$packId", totalRevenue: { $sum: "$price" } } },
    ]);
    const totalInvoices = await Invoice.countDocuments();
    const paidInvoices = await Invoice.countDocuments({ status: "paid" });
    const unpaidInvoices = await Invoice.countDocuments({
      status: { $ne: "paid" },
    });
    const subscriptionCounts = await Subscription.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const enterpriseCountByMonthAndYear = getEnterpriseCountByMonthAndYear();
    const dashboardData = {
      totalEntreprises,
      revenueBySubscription,
      totalInvoices,
      paidInvoices,
      unpaidInvoices,
      subscriptionCounts,
      enterpriseCountByMonthAndYear,
    };
    res.status(200).json(dashboardData);
  } catch (error) {
    console.error("Erreur : ", error);
    res
      .status(500)
      .send(
        "Erreur serveur lors de la recherche d'informations du tableau de bord"
      );
  }
};

const getEnterpriseCountByMonthAndYear = async(req, res) => {
  try {
    const enterpriseCountByMonthAndYear = await Entreprise.aggregate([
      {
        $project: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        }
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);
    res.status(200).json(enterpriseCountByMonthAndYear);
  } catch (error) {
    
  }
}
const ForgoutPass = async (req, res) => {
  try {
      console.log(req.body);
      const { email } = req.body;

      // Chercher l'entreprise avec l'email fourni
      const entreprise = await Entreprise.findOne({ email: email });
      if (!entreprise) {
          return res.json({ message: "Utilisateur non trouvé" });
      }

      // Créer un token JWT
      const token = jwt.sign({ id: entreprise._id }, "AbdelilahElgallati1230", { expiresIn: "1d" });

      // Configurer le transporteur de nodemailer
      var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
              user: "myinvoice06@gmail.com",
              pass: "ekiv afoc wbnb mrep", // Assurez-vous de stocker le mot de passe en toute sécurité
          },
      });

      // Contenu HTML de l'email avec du style
      const htmlContent = `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2 style="color: #333;">Réinitialisation du mot de passe</h2>
              <p>Bonjour,</p>
              <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le lien ci-dessous pour procéder :</p>
              <a 
                  href="http://localhost:3000/reset-password/${entreprise._id}/${token}" 
                  style="display: inline-block; padding: 10px 20px; margin: 10px 0; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;"
              >
                  Réinitialiser le mot de passe
              </a>
              <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
              <p>Merci,</p>
              <p>L'équipe MyInvoice</p>
          </div>
      `;

      // Définir les options de l'email
      var mailOptions = {
          from: 'myinvoice06@gmail.com',
          to: email,
          subject: 'Réinitialisation du mot de passe',
          html: htmlContent
      };

      // Envoyer l'email
      transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
              console.error('Erreur lors de l\'envoi de l\'email:', error.message);
              res.status(500).json({ message: 'Échec de l\'envoi de l\'email' });
          } else {
              res.status(200).json({ message: 'Email envoyé avec succès ! Vérifiez votre email.' });
          }
      });
  } catch (error) {
      console.error('Erreur dans ForgotPass:', error.message);
      res.status(500).json({ message: 'Erreur du serveur' });
  }
};
// const ForgoutPass = async (req, res)=>{
//     console.log(req.body)
//     const {email} = req.body;
//     Entreprise.findOne({email : email}).then (entreprise=>{
//       if(!entreprise){
//         return res.json({message : "User not existed"})
//       }
//       const token = jwt.sign({id : entreprise._id} , "AbdelilahElgallati1230",{expiresIn:"1d"})
//       var transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//           user: "myinvoice06@gmail.com",
//           pass: "ekiv afoc wbnb mrep",
//         },
//       });
      
//       var mailOptions = {
//         from: 'myinvoice06@gmail.com',
//         to: email,
//         subject: 'Reset password',
//         text: `http://localhost:3000/reset-password/${entreprise._id}/${token}`
//       };
      
//       transporter.sendMail(mailOptions, function(error, info){
//         if (error) {
//           console.error('Error sending email:', error.message);
//            res.status(500).json({ message: 'Failed to send email' })
//         } else {
//           res.status(200).json({ message: 'Email envoyez avec succes!!!!! Verifiez votre email  ' }); 
//         }
//       });
//     })
// }
const ResetPass = async(req,res)=>{
   console.log(req.body)
   const id  = req.body.id;
   const token  = req.body.token;
   const password= req.body.password;
    console.log(password);
   jwt.verify(token , "AbdelilahElgallati1230" , (err,decoded)=>{
    if(err){
      return res.json({Status : "Error with token"})
    }else{
        bcrypt.hash(password ,10).then(
          hash=>{
            Entreprise.findByIdAndUpdate({_id :id},{password : hash})
            .then(u=> res.send({Status : "Success"}))
            .catch(err=>res.send({Status:err}))
          }
        ).catch(err=>res.send({Status:err}))
      }
   })
}

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await Entreprise.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Incorrect password" });
      } else {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ message: "Password changed successfully" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardInfo,
  addEntreprise,
  getAllEntreprises,
  getOneEntreprise,
  updateEntreprise,
  removeEntreprise,
  login,
  getEnterpriseCountByMonthAndYear,
  getEntrepriseDetail,
  getEntrepriseByGoogleId,
  ForgoutPass,
  ResetPass,
  changePassword,
  uploadSignature,
};
