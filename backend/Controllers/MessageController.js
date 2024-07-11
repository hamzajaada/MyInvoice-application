const Message = require("../Models/MessageShema")

const addMessage = async (req, res) => {
  try {
    const MessageData = req.body;
    const message = new Message(MessageData);
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de l'ajout du Message");
  }
}

const  getAllMessages = async (req, res) => {
  try {
    const  messages = await Message.find().populate('userId', ['name', 'logo']);
    const organizedmessages = messages.map(message => {
      const createdAt = new Date(message.createdAt).toLocaleDateString('fr-FR');
      return {
        _id: message._id,
        enterpriseId: message.userId._id,
        enterpriseName: message.userId.name,
        enterpriseLogo: message.userId.logo, 
        createdAt: createdAt,
        message: message.message,
        status: message.status,
      };
    });
    res.status(201).json(organizedmessages);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche des Messages");
  }
}

const  getAllMessagesAccepter = async (req, res) => {
  try {
    const  messages = await Message.find({status: "accepter"}).populate('userId', ['name', 'logo']);
    const organizedmessages = messages.map(message => {
      const createdAt = new Date(message.createdAt).toLocaleDateString('fr-FR');
      return {
        _id: message._id,
        enterpriseId: message.userId._id,
        enterpriseName: message.userId.name,
        enterpriseLogo: message.userId.logo, 
        createdAt: createdAt,
        message: message.message,
        status: message.status,
      };
    });
    res.status(201).json(organizedmessages);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche des Messages");
  }
}

const  getOneMessage = async (req, res) => {
  try {
    const  message = await Message.findById(req.params.id);
    res.status(201).json(message);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche de Message");
  }
}

const  updateMessage = async (req,res)=>{
  try {
    const  message = await Message.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.status(201).json({success: true, message});
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la mise à jour de Message");
  }
}

const  removeMessage = async (req, res) => {
  try {
    const  message = await Message.findByIdAndDelete(req.params.id);
    res.status(201).json({success: true, message});
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la suppression de Message");
  }
}

module.exports = {addMessage,getAllMessages,getOneMessage,updateMessage,removeMessage,getAllMessagesAccepter};