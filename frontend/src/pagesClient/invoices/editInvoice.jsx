import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Grid,
  Divider,
  Card,
  useTheme,
} from "@mui/material";
import Header from "componentsAdmin/Header";
import {
  useGetOneInvoiceQuery,
  useUpdateInvoiceMutation,
  useRemoveInvoiceMutation,
  useGetClientsQuery,
  useGetProductsQuery,
} from "state/api";
import { useParams, useNavigate } from "react-router-dom";

const EditInvoice = () => {
  const Navigate = useNavigate();
  if (!localStorage.getItem("userId")) {
    Navigate("/");
  }
  const theme = useTheme();
  const { id } = useParams();
  const [invoice, setInvoice] = useState({
    userId: localStorage.getItem("userId") || "",
    clientId: "",
    invoiceNumber: "",
    date: new Date(),
    dueDate: new Date(),
    items: [{ productId: "", quantity: 0 }],
    status: "",
    amount: 0,
  });
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);

  const { data: invoiceData } = useGetOneInvoiceQuery(id);
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const { data: allClientsData } = useGetClientsQuery(userId);
  const { data: allProductsData } = useGetProductsQuery(userId);

  useEffect(() => {
    if (invoiceData) {
      setInvoice(invoiceData);
    }
  }, [invoiceData]);

  useEffect(() => {
    if (allClientsData) {
      setClients(allClientsData);
    }
  }, [allClientsData]);

  useEffect(() => {
    if (allProductsData) {
      setProducts(allProductsData);
    }
  }, [allProductsData]);

  const [updateInvoice] = useUpdateInvoiceMutation();
  const [removeInvoice] = useRemoveInvoiceMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoice((prevInvoice) => ({
      ...prevInvoice,
      [name]: value,
    }));
  };

  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    const year = dateObject.getFullYear();
    let month = (1 + dateObject.getMonth()).toString().padStart(2, "0");
    let day = dateObject.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleProductChange = (productId, value, isQuantityChange) => {
    setInvoice((prevInvoice) => ({
      ...prevInvoice,
      items: prevInvoice.items.map((item) => {
        if (item.productId === productId) {
          const updatedValue = isQuantityChange ? parseInt(value) : value;
          return { ...item, [isQuantityChange ? "quantity" : "productId"]: updatedValue };
        }
        return item;
      }),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      let updatedInvoice = { ...invoice };
      if (invoice.items.length > 0) {
        const Totalamount = invoice.items.reduce(
          (acc, item) =>
            acc +
            (allProductsData.find((product) => product._id === item.productId)?.price || 0) *
              item.quantity,
          0
        );
        updatedInvoice = { ...updatedInvoice, amount: Totalamount };
      } else {
        updatedInvoice = { ...updatedInvoice, amount: 0 };
      }
      await updateInvoice({ id, InvoiceData: updatedInvoice });
      Navigate(`/${userName}/factures`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteProduct = (productId) => {
    setInvoice((prevInvoice) => ({
      ...prevInvoice,
      items: prevInvoice.items.filter((item) => item.productId !== productId),
    }));
  };

  const handleDelete = async () => {
    try {
      await removeInvoice(id);
      Navigate(`/${userName}/factures`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddItem = () => {
    setInvoice((prevInvoice) => ({
      ...prevInvoice,
      items: [...prevInvoice.items, { productId: "", quantity: 0 }],
    }));
  };

  const handleCancel = () => {
    Navigate(`/${userName}/factures`);
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="EDITER FACTURE" subtitle="Modification de la facture que vous avez sélectionnez"/>
      <Box m={2} />
      <form onSubmit={handleSubmit}>
      <Card elevation={3} style={{ borderRadius: 8, padding: "1.5rem", marginBottom: "1.5rem" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Numéro de facture"
              name="invoiceNumber"
              value={invoice.invoiceNumber || ""}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status-select"
                value={invoice.status || ""}
                onChange={handleChange}
                name="status"
              >
                {["sent", "paid", "late"].map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date de création"
              type="date"
              name="date"
              value={invoice.date ? formatDate(invoice.date) : ""}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date d'échéance"
              type="date"
              name="dueDate"
              value={invoice.dueDate ? formatDate(invoice.dueDate) : ""}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="client-label">Client</InputLabel>
              <Select
                labelId="client-label"
                id="client-select"
                value={invoice.clientId || ""}
                onChange={handleChange}
                name="clientId"
              >
                {clients.map((client) => (
                  <MenuItem key={client._id} value={client._id}>
                    {client.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Divider />
            <Typography variant="h6" fontWeight="bold" color={theme.palette.primary[100]}><br/>Produits :<br/></Typography>
            {invoice.items &&
              invoice.items.map((item, index) => (
                <Box key={index} display="flex" alignItems="center" marginBottom="8px">
                  <Box marginRight="16px">
                    <Select
                      labelId={`product-label-${index}`}
                      id={`product-select-${index}`}
                      value={item.productId}
                      onChange={(e) => handleProductChange(item.productId, e.target.value, false)}
                      fullWidth
                      name={`product-${index}`}
                    >
                      {products.map((product) => (
                        <MenuItem key={product._id} value={product._id}>
                          {product.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                  <TextField
                    label="Quantité"
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleProductChange(item.productId, e.target.value, true)}
                    fullWidth
                    required
                    margin="normal"
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeleteProduct(item.productId)}
                    style={{ marginLeft: "16px" }}
                  >
                    Supprimer le produit
                  </Button>
                </Box>
              ))}
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddItem}
              style={{ marginTop: "16px" }}
            >
              Ajouter un produit
            </Button>
          </Grid>
        </Grid>
        </Card>
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button type="submit" variant="contained" color="primary">
            Modifier la facture
          </Button>
          <Button
            onClick={handleDelete}
            aria-label="delete"
            variant="contained"
            color="primary"
            style={{ marginLeft: "1rem" }}
          >
            Supprimer la facture
          </Button>
          </Box>
          <Box mt={2} display="flex" justifyContent="flex-end">
          <Button
            onClick={handleCancel}
            aria-label="cancel"
            variant="contained"
            color="secondary"
          >
            Annuler
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditInvoice;