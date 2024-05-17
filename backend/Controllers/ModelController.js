const Model = require('../Models/ModelSchema')

const addModel = async (req, res) => {
  try {
    const ModelData = req.body;
    const icon = req.file ? req.file.filename : null;
    const model = new Model({
      name: ModelData.name,
      description: ModelData.description,
      icon,
    });
    await model.save();
    res.status(201).json(model);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de l'ajout du Model");
  }
}

const  getAllModels = async (req, res) => {
  try {
    const  models = await Model.find();
    console.log('Model : ',models )
    res.status(201).json(models);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche des Models");
  }
}

const  getOneModel = async (req, res) => {
  try {
    const  model = await Model.findById(req.params.id);
    res.status(201).json(model);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche de Model");
  }
}

const updateModel = async (req, res) => {
  try {
    const icon = req.file ? req.file.filename : null;
    const modelData = { ...req.body };
    if (icon) {
      modelData.icon = icon;
    }
    const model = await Model.findByIdAndUpdate(req.params.id, modelData, { new: true });
    res.status(200).json(model);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la mise à jour de Model");
  }
};

const  removeModel = async (req, res) => {
  try {
    const  model = await Model.findByIdAndDelete(req.params.id);
    res.status(201).json(model);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la suppression de Model");
  }
}

module.exports = {addModel,getAllModels,getOneModel,updateModel,removeModel};