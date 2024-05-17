import React, { useState } from "react";
import {
  TextField,
  useTheme,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import Header from "componentsAdmin/Header";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useGetProductsQuery, useGetClientsQuery, useAddInvoiceMutation } from "state/api";
import { useNavigate } from "react-router-dom";

const AddInvoice = () => {
  const navigate = useNavigate();

  if (!localStorage.getItem("userId")) {
    navigate("/");
  }
  const theme = useTheme();
  const id = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const [invoice, setInvoice] = useState({
    userId: localStorage.getItem("userId") || "",
    clientId: "",
    invoiceNumber: "",
    dueDate: new Date(),
    items: [{ productId: "", quantity: 0 }],
    amount: 0,
  });
  const [AddInvoice] = useAddInvoiceMutation();
  const { data:  clientsData } = useGetClientsQuery(id);
  const { data: productsData } = useGetProductsQuery(id);

  const Navigate = useNavigate();

  const handleChange = (e) => {
    setInvoice({ ...invoice, [e.target.name]: e.target.value });
  };

  const handleProductAdd = () => {
    setInvoice({
      ...invoice,
      items: [...invoice.items, { productId: "", quantity: 0 }],
    });
  };

  const handleProductChange = (index, productId) => {
    const updatedItems = [...invoice.items];
    updatedItems[index].productId = productId;
    setInvoice({ ...invoice, items: updatedItems });
  };

  const handleQuantityChange = (index, quantity) => {
    const updatedItems = [...invoice.items];
    updatedItems[index].quantity = parseInt(quantity);
    setInvoice({ ...invoice, items: updatedItems });
  };

  const handleClientChange = (event) => {
    setInvoice({ ...invoice, clientId: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const amount = invoice.items.reduce(
        (acc, item) =>
          acc +
          (productsData.find((product) => product._id === item.productId)?.price || 0) *
          item.quantity,
        0
      );
      await AddInvoice({ invoice: { ...invoice, amount } });
      Navigate(`/${userName}/factures`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
    <Header title="AJOUTER DES FACTURES" subtitle="Ajout d'une nouvelle facture" />
    <Box m="1.5rem auto" maxWidth="800px" border={`2px solid ${theme.palette.primary.main}`} borderRadius="0.5rem" p="1rem">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Numéro de facture"
              name="invoiceNumber"
              value={invoice.invoiceNumber}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Date d'échéance"
              name="dueDate"
              type="date"
              value={invoice.dueDate}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="client-label">Sélectionnez Un Client</InputLabel>
              <Select
                labelId="client-label"
                id="client-select"
                value={invoice.clientId}
                onChange={handleClientChange}
                fullWidth
                required
              >
                {clientsData &&
                  clientsData.map((client) => (
                    <MenuItem key={client._id} value={client._id}>
                      {client.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={handleProductAdd}
              startIcon={<AddShoppingCartIcon />}
              fullWidth
            >
              Ajouter produit
            </Button>
          </Grid>
          {invoice.items.map((item, index) => (
            <React.Fragment key={index}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id={`product-label-${index}`}>Vos Produits</InputLabel>
                  <Select
                    labelId={`product-label-${index}`}
                    id={`product-select-${index}`}
                    value={item.productId}
                    onChange={(e) => handleProductChange(index, e.target.value)}
                    fullWidth
                    required
                  >
                    {productsData &&
                      productsData.map((product) => (
                        <MenuItem key={product._id} value={product._id}>
                          {product.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Quantité"
                  name={`quantity-${index}`}
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
            </React.Fragment>
          ))}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Ajouter la facture
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  </Box>
  );
};

export default AddInvoice;