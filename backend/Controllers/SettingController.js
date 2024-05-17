const Setting = require("../Models/SettingsSchema")


const addSetting = async (req, res) => {
  try {
    const settingData = req.body;
    const setting = new Setting(settingData);
    await setting.save();
    res.status(201).json(setting);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de l'ajout du parametre");
  }
}

const  getAllSettings = async (req, res) => {
  try {
    const  setting = await Setting.find();
    res.status(201).json(setting);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche des parametres");
  }
}

const  getOneSetting = async (req, res) => {
  try {
    const  setting = await Setting.findById(req.params.id);
    res.status(201).json(setting);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche de parametre");
  }
}

const  updateSetting = async (req,res)=>{
  try {
    const  setting = await setting.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.status(201).json(setting);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la mise à jour de parametre");
  }
}

const  removeSetting = async (req, res) => {
  try {
    const  setting = await Setting.findByIdAndDelete(req.params.id);
    res.status(201).json(setting);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la suppression de parametre");
  }
}



module.exports = {addSetting,getAllSettings,getOneSetting,updateSetting,removeSetting};