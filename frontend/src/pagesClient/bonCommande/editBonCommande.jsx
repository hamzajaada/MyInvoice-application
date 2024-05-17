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
  useGetOneBonCommandeQuery,
  useUpdateBonCommandeMutation,
  useRemoveBonCommandeMutation,
  useGetFournisseursQuery,
  useGetProductsQuery,
} from "state/api";
import { useParams, useNavigate } from "react-router-dom";

const EditBonCommande = () => {
  const Navigate = useNavigate();
  if (!localStorage.getItem("userId")) {
    Navigate("/");
  }
  const theme = useTheme();
  const { id } = useParams();
  const [bonCommande, setBonCommande] = useState({
    userId: localStorage.getItem("userId") || "",
    clientId: "",
    date: new Date(),
    dueDate: new Date(),
    items: [{ productId: "", quantity: 0 }],
    status: "",
    amount: 0,
  });
  const [fournisseurs, setFournisseurs] = useState([]);
  const [products, setProducts] = useState([]);

  const { data: bonCommandeData } = useGetOneBonCommandeQuery(id);
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const { data: allFournisseursData } = useGetFournisseursQuery(userId);
  const { data: allProductsData } = useGetProductsQuery(userId);

  useEffect(() => {
    if (bonCommandeData) {
      setBonCommande(bonCommandeData);
    }
  }, [bonCommandeData]);

  useEffect(() => {
    if (allFournisseursData) {
      setFournisseurs(allFournisseursData);
    }
  }, [allFournisseursData]);

  useEffect(() => {
    if (allProductsData) {
      setProducts(allProductsData);
    }
  }, [allProductsData]);

  const [updateInvoice] = useUpdateBonCommandeMutation();
  const [removeBonCommande] = useRemoveBonCommandeMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBonCommande((prevBonCommande) => ({
      ...prevBonCommande,
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
    setBonCommande((prevBonCommande) => ({
      ...prevBonCommande,
      items: prevBonCommande.items.map((item) => {
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
      let updatedBonCommande = { ...bonCommande };
      if (bonCommande.items.length > 0) {
        const Totalamount = bonCommande.items.reduce(
          (acc, item) =>
            acc +
            (allProductsData.find((product) => product._id === item.productId)?.price || 0) *
              item.quantity,
          0
        );
        updatedBonCommande = { ...updatedBonCommande, amount: Totalamount };
      } else {
        updatedBonCommande = { ...updatedBonCommande, amount: 0 };
      }
      await updateInvoice({ id, bonCommandeData: updatedBonCommande });
      Navigate(`/${userName}/bon-commandes`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteProduct = (productId) => {
    setBonCommande((prevBonCommande) => ({
      ...prevBonCommande,
      items: prevBonCommande.items.filter((item) => item.productId !== productId),
    }));
  };

  const handleDelete = async () => {
    try {
      await removeBonCommande(id);
      Navigate(`/${userName}/bon-commandes`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddItem = () => {
    setBonCommande((prevBonCommande) => ({
      ...prevBonCommande,
      items: [...prevBonCommande.items, { productId: "", quantity: 0 }],
    }));
  };

  const handleCancel = () => {
    Navigate(`/${userName}/bon-commandes`);
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="EDITER FACTURE" subtitle="Modification de la facture que vous avez sélectionnez"/>
      <Box m={2} />
      <form onSubmit={handleSubmit}>
      <Card elevation={3} style={{ borderRadius: 8, padding: "1.5rem", marginBottom: "1.5rem" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={16}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status-select"
                value={bonCommande.status || ""}
                onChange={handleChange}
                name="status"
              >
                {["attent de traitement", "au cour de traitement", "expédié"].map((status) => (
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
              value={bonCommande.date ? formatDate(bonCommande.date) : ""}
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
              value={bonCommande.dueDate ? formatDate(bonCommande.dueDate) : ""}
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
                value={bonCommande.clientId || ""}
                onChange={handleChange}
                name="clientId"
              >
                {fournisseurs.map((fournisseur) => (
                  <MenuItem key={fournisseur._id} value={fournisseur._id}>
                    {fournisseur.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Divider />
            <Typography variant="h6" fontWeight="bold" color={theme.palette.primary[100]}><br/>Produits :<br/></Typography>
            {bonCommande.items &&
              bonCommande.items.map((item, index) => (
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

export default EditBonCommande;