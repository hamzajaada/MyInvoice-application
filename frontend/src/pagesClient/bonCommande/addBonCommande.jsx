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
  useGetFournisseursQuery,
  useAddBonCommandeMutation,
} from "state/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddBonCommande = () => {
  const navigate = useNavigate();

  if (!localStorage.getItem("userId")) {
    navigate("/");
  }
  const theme = useTheme();
  const id = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const [bonCommande, setBonCommande] = useState({
    userId: localStorage.getItem("userId") || "",
    fournisseurId: "",
    dueDate: new Date().toISOString().split("T")[0], // Formatted date for the date input
    items: [{ productId: "", quantity: 0 }],
    taxes: [{ taxId: "" }],
    amount: 0,
  });
  const [addBonCommande] = useAddBonCommandeMutation();
  const { data: fournisseursData } = useGetFournisseursQuery(id);
  const { data: productsData } = useGetProductsQuery(id);
  const { data: taxData } = useGetAllTaxEntrepriseQuery(id);

  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (productsData && taxData) {
      calculateTotalAmount();
    }
  }, [bonCommande.items, bonCommande.taxes, productsData, taxData]);

  const calculateTotalAmount = () => {
    let totalAmount = 0;
    totalAmount = bonCommande.items.reduce(
      (acc, item) =>
        acc +
        (productsData?.find((product) => product._id === item.productId)
          ?.price || 0) *
          item.quantity,
      0
    );

    const taxValue = bonCommande.taxes.reduce((acc, item) => {
      const tax = taxData?.find((taxe) => taxe._id === item.taxId);
      return acc + (tax ? tax.TaksValleur : 0);
    }, 0);
    totalAmount = totalAmount * (1 + taxValue / 100);
    setTotalAmount(totalAmount);
  };

  const handleChange = (e) => {
    setBonCommande({ ...bonCommande, [e.target.name]: e.target.value });
  };

  const handleProductAdd = () => {
    setBonCommande({
      ...bonCommande,
      items: [...bonCommande.items, { productId: "", quantity: 0 }],
    });
  };

  const handleTaxAdd = () => {
    setBonCommande({
      ...bonCommande,
      taxes: [...bonCommande.taxes, { taxId: "" }],
    });
  };

  const handleProductChange = (index, productId) => {
    const updatedItems = [...bonCommande.items];
    updatedItems[index].productId = productId;
    setBonCommande({ ...bonCommande, items: updatedItems });
  };

  const handleTaxChange = (index, taxId) => {
    const updatedTaxes = [...bonCommande.taxes];
    updatedTaxes[index].taxId = taxId;
    setBonCommande({ ...bonCommande, taxes: updatedTaxes });
  };

  const handleQuantityChange = (index, quantity) => {
    const updatedItems = [...bonCommande.items];
    updatedItems[index].quantity = parseInt(quantity);
    setBonCommande({ ...bonCommande, items: updatedItems });
  };

  const handleFournisseurChange = (event) => {
    setBonCommande({ ...bonCommande, fournisseurId: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      let amount = bonCommande.items.reduce((acc, item) => {
        const product = productsData.find(
          (product) => product._id === item.productId
        );
        return acc + (product ? product.price * item.quantity : 0);
      }, 0);
      if(bonCommande.taxes.length > 0) {
        const taxes = bonCommande.taxes.reduce((acc, item) => {
          const tax = taxData.find((taxe) => taxe._id === item.taxId);
          return acc + (tax ? tax.TaksValleur : 0);
        }, 0);
        amount = amount * (1 + taxes / 100);
      }
      const {data} = await addBonCommande({ bonCommande: { ...bonCommande, amount } });
      if (data.success) {
        toast.success("Bon de commande ajouté avec succès");
        navigate(`/${userName}/bon-commandes`);
      } else {
        toast.error("Le bon de commande ne pas ajouté avec succès");
      }
      
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="AJOUTER DES BON DE COMMANDE"
        subtitle="Ajout d'une nouvelle bon de commande"
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
                value={bonCommande.dueDate}
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
                <InputLabel id="fournisseur-label">
                  Sélectionnez Un Fournisseur
                </InputLabel>
                <Select
                  labelId="fournisseur-label"
                  id="fournisseur-select"
                  value={bonCommande.fournisseurId}
                  onChange={handleFournisseurChange}
                  fullWidth
                  required
                >
                  {fournisseursData &&
                    fournisseursData.map((fournisseur) => (
                      <MenuItem key={fournisseur._id} value={fournisseur._id}>
                        {fournisseur.name}
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
            {bonCommande.items.map((item, index) => {
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
                Ajouter de tax
              </Button>
            </Grid>
            {bonCommande.taxes.map((tax, index) => (
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
                Ajouter le bon de commande
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
};

export default AddBonCommande;
