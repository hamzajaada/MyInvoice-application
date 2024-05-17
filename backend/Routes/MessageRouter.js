const express = require("express");
const MessageRouter = express.Router();
const MessageController = require("../Controllers/MessageController");

MessageRouter.get( "/accepter", MessageController.getAllMessagesAccepter);
MessageRouter.get( "/", MessageController.getAllMessages); 
MessageRouter.get( "/:id", MessageController.getOneMessage); 
MessageRouter.post('/add',MessageController.addMessage);
MessageRouter.put('/edit/:id',MessageController.updateMessage);
MessageRouter.delete("/remove/:id",MessageController.removeMessage);

module.exports = MessageRouter;