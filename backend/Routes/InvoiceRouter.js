const express = require("express"); 
const InvoiceRouter = express.Router();
const InvoiceController = require("../Controllers/InvoiceController");

InvoiceRouter.get( "/dashboard/:id", InvoiceController.getDashboardStats); 
InvoiceRouter.get( "/summary/:id", InvoiceController.getSales); 
InvoiceRouter.get( "/details/:id", InvoiceController.prepareInvoiceDetails); 
InvoiceRouter.get( "/List/:id", InvoiceController.getAllInvoices); 
InvoiceRouter.get( "/:id", InvoiceController.getOneInvoice); 
InvoiceRouter.post('/add',InvoiceController.addInvoice);
InvoiceRouter.post('/email',InvoiceController.sendEmail);
InvoiceRouter.put('/edit/:id',InvoiceController.updateInvoice);
InvoiceRouter.delete("/remove/:id",InvoiceController.removeInvoice);
module.exports = InvoiceRouter;