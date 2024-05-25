import React, { useState, useEffect } from "react";
import {
  Typography,
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
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import {
  useGetProductsQuery,
  useGetAllTaxEntrepriseQuery,
  useGetClientsQuery,
  useAddInvoiceMutation,
} from "state/api";
import { useNavigate } from "react-router-dom";
import { format, isAfter, parseISO, startOfDay } from "date-fns";
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
    dueDate: format(new Date(), "yyyy-MM-dd"),
    items: [{ productId: "", quantity: 0 }],
    taxes: [{ taxId: "" }],
    amount: 0,
  });
  const [AddInvoice] = useAddInvoiceMutation();
  const { data: clientsData } = useGetClientsQuery(id);
  const { data: productsData } = useGetProductsQuery(id);
  const { data: taxData } = useGetAllTaxEntrepriseQuery(id);

  const Navigate = useNavigate();

  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (productsData && taxData) {
      calculateTotalAmount();
    }
  }, [invoice.items, invoice.taxes, productsData, taxData]);

  const calculateTotalAmount = () => {
    let totalAmount = 0;
    totalAmount = invoice.items.reduce(
      (acc, item) =>
        acc +
        (productsData?.find((product) => product._id === item.productId)
          ?.price || 0) *
          item.quantity,
      0
    );

    if(invoice.taxes.length > 0) {
      const taxValue = invoice.taxes.reduce((acc, item) => {
        const tax = taxData?.find((taxe) => taxe._id === item.taxId);
        return acc + (tax ? tax.TaksValleur : 0);
      }, 0);
      totalAmount = totalAmount * (1 + taxValue / 100);
    }
    setTotalAmount(totalAmount);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "dueDate") {
      const selectedDate = parseISO(value);
      const today = startOfDay(new Date());
      if (
        isAfter(selectedDate, today) ||
        selectedDate.getTime() === today.getTime()
      ) {
        setInvoice({ ...invoice, [name]: value });
      } else {
        alert(
          "La date d'échéance doit être supérieure ou égale à la date actuelle."
        );
      }
    } else {
      setInvoice({ ...invoice, [name]: value });
    }
  };

  const handleProductAdd = () => {
    setInvoice({
      ...invoice,
      items: [...invoice.items, { productId: "", quantity: 0 }],
    });
  };

  const handleTaxAdd = () => {
    setInvoice({
      ...invoice,
      taxes: [...invoice.taxes, { taxId: "" }],
    });
  };

  const handleProductChange = (index, productId) => {
    const updatedItems = [...invoice.items];
    updatedItems[index].productId = productId;
    setInvoice({ ...invoice, items: updatedItems });
  };

  const handleTaxChange = (index, taxId) => {
    const updatedTaxes = [...invoice.taxes];
    updatedTaxes[index].taxId = taxId;
    setInvoice({ ...invoice, taxes: updatedTaxes });
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
      let amount = invoice.items.reduce(
        (acc, item) =>
          acc +
          (productsData.find((product) => product._id === item.productId)
            ?.price || 0) *
            item.quantity,
        0
      );
      const taxes = invoice.taxes.reduce((acc, item) => {
        const tax = taxData.find((taxe) => taxe._id === item.taxId);
        return acc + (tax ? tax.TaksValleur : 0);
      }, 0);
      amount = amount * (1 + taxes / 100);
      await AddInvoice({ invoice: { ...invoice, amount } });
      Navigate(`/${userName}/factures`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="AJOUTER DES FACTURES"
        subtitle="Ajout d'une nouvelle facture"
      />
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
                <InputLabel id="client-label">
                  Sélectionnez Un Client
                </InputLabel>
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
            {invoice.items.map((item, index) => {
              const selectedProduct = Array.isArray(productsData)
                ? productsData.find((product) => product._id === item.productId)
                : undefined;
              return (
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
                      inputProps={{
                        max: selectedProduct ? selectedProduct.quantity : 0,
                        min: 1,
                      }}
                      onChange={(e) =>
                        handleQuantityChange(index, e.target.value)
                      }
                      fullWidth
                      required
                      margin="20px"
                    />
                  </Grid>
                </React.Fragment>
              );
            })}
            <Grid item xs={12}>
              <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={handleTaxAdd}
                startIcon={<AddShoppingCartIcon />}
                fullWidth
              >
                Ajouter taxe
              </Button>
            </Grid>
            {invoice.taxes.map((tax, index) => (
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
                Ajouter la facture
              </Button>
            </Grid>
          </Grid>
          <Box mt={2} display="flex" justifyContent="center">
            <Button
              onClick={() => navigate(-1)}
              aria-label="cancel"
              variant="contained"
              color="warning"
            >
              Annuler
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default AddInvoice;
