const Client = require("../Models/ClientSchema");

const addClient = async (req, res) => {
  try {
    console.log(req.body)
    const ClientData = req.body.client;
    const client = new Client(ClientData);
    await client.save();
    res.status(201).json(client);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de l'ajout du client");
  }
};

const getAllClientsEnt = async (req, res) => {
  try {
    const AllClients = await Client.find({active : true});
    const clients = AllClients.filter(
      (client) => client.userId.toString() === req.params.id
    );
    res.status(200).json(clients);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getOneClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    res.status(201).json(client);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche de client");
  }
};

const updateClient = async (req, res) => {
  try {
    //console.log("data : ", req);
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({success: true, client});
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la mise à jour de client");
  }
};

const removeClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    res.status(201).json(client);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la suppression de client");
  }
};

module.exports = {
  addClient,
  getAllClientsEnt,
  getOneClient,
  updateClient,
  removeClient,
};
