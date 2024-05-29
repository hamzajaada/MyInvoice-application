const Model = require('../Models/ModelSchema')
const cloudinary = require("../Utils/cloudinary");

const addModel = async (req, res) => {
  try {
    const ModelData = req.body;
    const result = await cloudinary.uploader.upload(ModelData.icon, {
      folder: "Model",
    });
    const model = new Model({
      userId: ModelData.userId,
      name: ModelData.name,
      description: ModelData.description,
      icon: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });
    await model.save();
    res.status(201).json({ success: true, model });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erreur serveur lors de l'ajout du model",
      error,
    });
  }
};

const  getAllModels = async (req, res) => {
  try {
    const  models = await Model.find({active:true});
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
    const currentModel = await Model.findById(req.params.id);
    const data = {
      userId: req.body.userId,
      name: req.body.name,
      description: req.body.description,
    };
    if (req.file) {
      const ImgId = currentModel.logo.public_id;
      if (ImgId) {
        await cloudinary.uploader.destroy(ImgId);
      }

      const result = await cloudinary.uploader
        .upload_stream(
          {
            folder: "Model",
          },
          async (error, result) => {
            if (error) {
              console.error(error);
              res.status(500).send({
                success: false,
                message: "Erreur serveur lors de la mise à jour de model",
                error,
              });
            } else {
              data.icon = {
                public_id: result.public_id,
                url: result.secure_url,
              };

              const updatedModel = await Model.findByIdAndUpdate(
                req.params.id,
                data,
                {
                  new: true,
                }
              );
              res.status(200).json({
                success: true,
                updatedModel,
              });
            }
          }
        )
        .end(req.file.buffer);
    } else {
      const updatedModel = await Model.findByIdAndUpdate(req.params.id, data, {
        new: true,
      });
      res.status(200).json({
        success: true,
        updatedModel,
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Erreur serveur lors de la mise à jour du model",
      error,
    });
  }
};

const updateModelActive = async (req, res) => {
  try {
    const model = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      model,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la suppression de model",
      error,
    });
  }
}

const  removeModel = async (req, res) => {
  try {
    const  model = await Model.findByIdAndDelete(req.params.id);
    res.status(201).json(model);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la suppression de Model");
  }
}

module.exports = {addModel,getAllModels,getOneModel,updateModel,removeModel,updateModelActive};