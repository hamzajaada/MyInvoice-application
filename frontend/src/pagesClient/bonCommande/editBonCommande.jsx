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
  useGetFournisseursQuery,
  useGetProductsQuery,
  useGetAllTaxEntrepriseQuery,
} from "state/api";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditBonCommande = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { id } = useParams();

  if (!localStorage.getItem("userId")) {
    navigate("/");
  }

  const [bonCommande, setBonCommande] = useState({
    userId: localStorage.getItem("userId") || "",
    fournisseurId: "",
    date: new Date(),
    dueDate: new Date(),
    items: [{ productId: "", quantity: 0 }],
    taxes: [{ taxId: "" }],
    status: "",
    amount: 0,
  });
  const [fournisseurs, setFournisseurs] = useState([]);
  const [products, setProducts] = useState([]);
  const [taxes, setTaxes] = useState([]);

  const { data: bonCommandeData } = useGetOneBonCommandeQuery(id);
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const { data: allFournisseursData } = useGetFournisseursQuery(userId);
  const { data: allProductsData } = useGetProductsQuery(userId);
  const { data: allTaxData } = useGetAllTaxEntrepriseQuery(userId);

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

  useEffect(() => {
    if (allTaxData) {
      setTaxes(allTaxData);
    }
  }, [allTaxData]);

  const [updateBonCommande] = useUpdateBonCommandeMutation();

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

  const handleProductChange = (index, field, value) => {
    setBonCommande((prevBonCommande) => {
      const updatedItems = [...prevBonCommande.items];
      updatedItems[index] = { ...updatedItems[index], [field]: value };
      return { ...prevBonCommande, items: updatedItems };
    });
  };

  const handleTaxesChange = (index, field, value) => {
    setBonCommande((prevBonCommande) => {
      const updatedTaxes = [...prevBonCommande.taxes];
      updatedTaxes[index] = { ...updatedTaxes[index], [field]: value };
      return { ...prevBonCommande, taxes: updatedTaxes };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      let totalAmount = 0;
      let updatedBonCommande = { ...bonCommande };

      if (bonCommande.items.length > 0) {
        totalAmount = bonCommande.items.reduce(
          (acc, item) =>
            acc +
            (allProductsData.find((product) => product._id === item.productId)
              ?.price || 0) *
              item.quantity,
          0
        );
      }

      if (bonCommande.taxes.length > 0) {
        const taxesAmount = bonCommande.taxes.reduce((acc, item) => {
          const tax = allTaxData.find((taxe) => taxe._id === item.taxId);
          return acc + (tax ? tax.TaksValleur : 0);
        }, 0);
        totalAmount = totalAmount * (1 + taxesAmount / 100);
      }

      updatedBonCommande = { ...updatedBonCommande, amount: totalAmount };

      const { data } = await updateBonCommande({
        id,
        bonCommandeData: updatedBonCommande,
      });
      if (data.success) {
        toast.success("Bon de commande modifié avec succès");
        navigate(`/${userName}/bon-commandes`);
      } else {
        toast.error("Le bon de commande ne pas modifié avec succès");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteProduct = (index) => {
    setBonCommande((prevBonCommande) => ({
      ...prevBonCommande,
      items: prevBonCommande.items.filter((_, i) => i !== index),
    }));
  };

  const handleDeleteTax = (index) => {
    setBonCommande((prevBonCommande) => ({
      ...prevBonCommande,
      taxes: prevBonCommande.taxes.filter((_, i) => i !== index),
    }));
  };

  const handleDelete = async () => {
    try {
      if (bonCommandeData) {
        const newBon = { ...bonCommandeData, active: false };
        const { data } = await updateBonCommande({
          id,
          bonCommandeData: newBon,
        });
        if (data.success) {
          toast.success("Bon de commande supprimé avec succès");
          navigate(`/${userName}/bon-commandes`);
        } else {
          toast.error("Le bon de commande ne pas supprimé avec succès");
        }
      }
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

  const handleAddTax = () => {
    setBonCommande((prevBonCommande) => ({
      ...prevBonCommande,
      taxes: [...prevBonCommande.taxes, { taxId: "" }],
    }));
  };

  const handleCancel = () => {
    navigate(`/${userName}/bon-commandes`);
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="MODIFIER LE BON DE COMMANDE"
        subtitle="Modification du bon de commande que vous avez sélectionnez"
      />
      <Box m={2} />
      <form onSubmit={handleSubmit}>
        <Card
          elevation={3}
          style={{ borderRadius: 8, padding: "1.5rem", marginBottom: "1.5rem" }}
        >
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
                  {[
                    "attent de traitement",
                    "au cour de traitement",
                    "expédié",
                  ].map((status) => (
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
                value={
                  bonCommande.dueDate ? formatDate(bonCommande.dueDate) : ""
                }
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="client-label">Fournisseur</InputLabel>
                <Select
                  labelId="client-label"
                  id="client-select"
                  value={bonCommande.fournisseurId || ""}
                  onChange={handleChange}
                  name="fournisseurId"
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
              <Typography
                variant="h6"
                fontWeight="bold"
                color={theme.palette.primary[100]}
              >
                <br />
                Produits :<br />
              </Typography>
              {bonCommande.items &&
                bonCommande.items.map((item, index) => {
                  const selectedProduct = Array.isArray(allProductsData)
                    ? allProductsData.find(
                        (product) => product._id === item.productId
                      )
                    : undefined;
                  return (
                    <Box
                      key={index}
                      display="flex"
                      alignItems="center"
                      marginBottom="8px"
                    >
                      <Box marginRight="16px" width={"90%"}>
                        <Select
                          labelId={`product-label-${index}`}
                          id={`product-select-${index}`}
                          value={item.productId}
                          onChange={(e) =>
                            handleProductChange(
                              index,
                              "productId",
                              e.target.value
                            )
                          }
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
                        inputProps={{
                          max: selectedProduct ? selectedProduct.quantity : 0,
                          min: 1,
                        }}
                        onChange={(e) =>
                          handleProductChange(index, "quantity", e.target.value)
                        }
                        width={"20%"}
                        required
                        margin="normal"
                      />
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDeleteProduct(index)}
                        style={{ marginLeft: "16px" }}
                      >
                        Supprimer le produit
                      </Button>
                    </Box>
                  );
                })}
              <Button
                width={"40%"}
                variant="contained"
                color="primary"
                onClick={handleAddItem}
                style={{ marginTop: "16px" }}
              >
                Ajouter un produit
              </Button>
              <Divider sx={{ marginTop: "20px" }} />
              <Typography
                variant="h6"
                fontWeight="bold"
                color={theme.palette.primary[100]}
              >
                <br />
                Taxes :<br />
              </Typography>
              {bonCommande.taxes &&
                bonCommande.taxes.map((item, index) => (
                  <Box
                    key={index}
                    display="flex"
                    alignItems="center"
                    marginBottom="8px"
                  >
                    <Box marginRight="16px" width={"100%"}>
                      <Select
                        labelId={`tax-label-${index}`}
                        id={`tax-select-${index}`}
                        value={item.taxId}
                        onChange={(e) =>
                          handleTaxesChange(index, "taxId", e.target.value)
                        }
                        fullWidth
                        name={`tax-${index}`}
                      >
                        {taxes.map((tax) => (
                          <MenuItem key={tax._id} value={tax._id}>
                            {tax.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                    <Button
                      width={"40%"}
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDeleteTax(index)}
                      style={{ marginLeft: "16px" }}
                    >
                      Supprimer le taxe
                    </Button>
                  </Box>
                ))}
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddTax}
                style={{ marginTop: "16px" }}
              >
                Ajouter une taxe
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
