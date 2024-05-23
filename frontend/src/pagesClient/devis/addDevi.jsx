import React, { useState, useEffect } from "react";
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
  Typography,
} from "@mui/material";
import Header from "componentsAdmin/Header";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import {
  useGetProductsQuery,
  useGetAllTaxEntrepriseQuery,
  useGetClientsQuery,
  useAddDeviMutation,
} from "state/api";
import { useNavigate } from "react-router-dom";

const AddDevi = () => {
  const navigate = useNavigate();

  if (!localStorage.getItem("userId")) {
    navigate("/");
  }
  const theme = useTheme();
  const id = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const [devi, setDevi] = useState({
    userId: localStorage.getItem("userId") || "",
    clientId: "",
    Date: new Date(),
    items: [{ productId: "", quantity: 0 }],
    taxes: [{ taxId: "" }],
    amount: 0,
  });
  const [AddDevi] = useAddDeviMutation();
  const { data: clientsData } = useGetClientsQuery(id);
  const { data: productsData } = useGetProductsQuery(id);
  const { data: taxData } = useGetAllTaxEntrepriseQuery(id);

  const Navigate = useNavigate();

  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (productsData && taxData) {
      calculateTotalAmount();
    }
  }, [devi.items, devi.taxes, productsData, taxData]);

  const calculateTotalAmount = () => {
    let totalAmount = 0;
    totalAmount = devi.items.reduce(
      (acc, item) =>
        acc +
        (productsData?.find((product) => product._id === item.productId)
          ?.price || 0) *
          item.quantity,
      0
    );

    const taxValue = devi.taxes.reduce((acc, item) => {
      const tax = taxData?.find((taxe) => taxe._id === item.taxId);
      return acc + (tax ? tax.TaksValleur : 0);
    }, 0);
    totalAmount = totalAmount * (1 + taxValue / 100);
    setTotalAmount(totalAmount);
  };

  const handleChange = (e) => {
    setDevi({ ...devi, [e.target.name]: e.target.value });
  };

  const handleTaxAdd = () => {
    setDevi({
      ...devi,
      taxes: [...devi.taxes, { taxId: "" }],
    });
  };

  const handleProductAdd = () => {
    setDevi({
      ...devi,
      items: [...devi.items, { productId: "", quantity: 0 }],
    });
  };

  const handleProductChange = (index, productId) => {
    const updatedItems = [...devi.items];
    updatedItems[index].productId = productId;
    setDevi({ ...devi, items: updatedItems });
  };

  const handleTaxChange = (index, taxId) => {
    const updatedTaxes = [...devi.taxes];
    updatedTaxes[index].taxId = taxId;
    setDevi({ ...devi, taxes: updatedTaxes });
  };

  const handleQuantityChange = (index, quantity) => {
    const updatedItems = [...devi.items];
    updatedItems[index].quantity = parseInt(quantity);
    setDevi({ ...devi, items: updatedItems });
  };

  const handleClientChange = (event) => {
    setDevi({ ...devi, clientId: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      let amount = devi.items.reduce(
        (acc, item) =>
          acc +
          (productsData.find((product) => product._id === item.productId)
            ?.price || 0) *
            item.quantity,
        0
      );
      const taxes = devi.taxes.reduce((acc, item) => {
        const tax = taxData.find((taxe) => taxe._id === item.taxId);
        return acc + (tax ? tax.TaksValleur : 0);
      }, 0);
      console.log("taxes : ", taxes);
      amount = amount * (1 + taxes / 100);
      await AddDevi({ devi: { ...devi, amount } });
      Navigate(`/${userName}/devis`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="AJOUTER DES DEVIS" subtitle="Ajout d'un nouvelle devi" />
      <Box
        m="1.5rem auto"
        fullWidth
        border={`2px solid ${theme.palette.primary.main}`}
        borderRadius="0.5rem"
        p="1rem"
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Date"
                name="date"
                type="date"
                value={devi.date}
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
                <InputLabel id="client-label">
                  Sélectionnez Un Client
                </InputLabel>
                <Select
                  labelId="client-label"
                  id="client-select"
                  value={devi.clientId}
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
            {devi.items.map((item, index) => (
              <React.Fragment key={index}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id={`product-label-${index}`}>
                      Vos Produits
                    </InputLabel>
                    <Select
                      labelId={`product-label-${index}`}
                      id={`product-select-${index}`}
                      value={item.productId}
                      onChange={(e) =>
                        handleProductChange(index, e.target.value)
                      }
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
                    onChange={(e) =>
                      handleQuantityChange(index, e.target.value)
                    }
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
              </React.Fragment>
            ))}
            <Grid item xs={12}>
              <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={handleTaxAdd}
                startIcon={<AddShoppingCartIcon />}
                fullWidth
              >
                Ajouter de tax
              </Button>
            </Grid>
            {devi.taxes.map((tax, index) => (
              <React.Fragment key={index}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id={`tax-label-${index}`}>Vos Taxes</InputLabel>
                    <Select
                      labelId={`tax-label-${index}`}
                      id={`tax-select-${index}`}
                      value={tax.taxId}
                      onChange={(e) => handleTaxChange(index, e.target.value)}
                      fullWidth
                      required
                    >
                      {taxData &&
                        taxData.map((taxe) => (
                          <MenuItem key={taxe._id} value={taxe._id}>
                            {taxe.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
              </React.Fragment>
            ))}
            <Grid item xs={12} display="flex" justifyContent="center">
              <Box
                p={2}
                border={`2px solid ${theme.palette.primary.light}`}
                borderRadius="0.5rem"
                bgcolor={theme.palette.background.alt}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color={theme.palette.secondary.main}
                >
                  Montant Total: {totalAmount.toFixed(2)} DH
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Ajouter la devi
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
};

export default AddDevi;
