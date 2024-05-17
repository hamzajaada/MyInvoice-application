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
import { useGetProductsQuery, useGetFournisseursQuery, useAddBonCommandeMutation } from "state/api";
import { useNavigate } from "react-router-dom";

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
    dueDate: new Date(),
    items: [{ productId: "", quantity: 0 }],
    amount: 0,
  });
  const [AddBonCommande] = useAddBonCommandeMutation();
  const { data: fournisseursData } = useGetFournisseursQuery(id);
  const { data: productsData } = useGetProductsQuery(id);

  const Navigate = useNavigate();

  const handleChange = (e) => {
    setBonCommande({ ...bonCommande, [e.target.name]: e.target.value });
  };

  const handleProductAdd = () => {
    setBonCommande({
      ...bonCommande,
      items: [...bonCommande.items, { productId: "", quantity: 0 }],
    });
  };

  const handleProductChange = (index, productId) => {
    const updatedItems = [...bonCommande.items];
    updatedItems[index].productId = productId;
    setBonCommande({ ...bonCommande, items: updatedItems });
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
      const amount = bonCommande.items.reduce(
        (acc, item) =>
          acc +
          (productsData.find((product) => product._id === item.productId)?.price || 0) *
          item.quantity,
        0
      );
      await AddBonCommande({ bonCommande: { ...bonCommande, amount } });
      Navigate(`/${userName}/bon-commandes`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
    <Header title="AJOUTER DES BON DE COMMANDE" subtitle="Ajout d'une nouvelle bon de commande" />
    <Box m="1.5rem auto" fullWidth border={`2px solid ${theme.palette.primary.main}`} borderRadius="0.5rem" p="1rem">
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
              <InputLabel id="client-label">Sélectionnez Un Fournisseur</InputLabel>
              <Select
                labelId="client-label"
                id="client-select"
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
          {bonCommande.items.map((item, index) => (
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