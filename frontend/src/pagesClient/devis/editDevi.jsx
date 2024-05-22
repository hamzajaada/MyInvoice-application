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
  useGetOneDeviQuery,
  useUpdateDeviMutation,
  useGetClientsQuery,
  useGetProductsQuery,
  useGetAllTaxEntrepriseQuery,
} from "state/api";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditInvoice = () => {
  const Navigate = useNavigate();
  if (!localStorage.getItem("userId")) {
    Navigate("/");
  }
  const theme = useTheme();
  const { id } = useParams();
  const [devi, setDevi] = useState({
    userId: localStorage.getItem("userId") || "",
    clientId: "",
    date: new Date(),
    items: [{ productId: "", quantity: 0 }],
    taxes: [{ taxId: "" }],
    status: "",
    amount: 0,
  });
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [taxes, setTaxes] = useState([]);

  const { data: deviData } = useGetOneDeviQuery(id);
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const { data: allClientsData } = useGetClientsQuery(userId);
  const { data: allProductsData } = useGetProductsQuery(userId);
  const { data: allTaxData } = useGetAllTaxEntrepriseQuery(userId);

  useEffect(() => {
    if (deviData) {
      setDevi(deviData);
    }
  }, [deviData]);

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

  useEffect(() => {
    if (allTaxData) {
      setTaxes(allTaxData);
    }
  }, [allTaxData]);

  const [updateDevi] = useUpdateDeviMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDevi((prevDevi) => ({
      ...prevDevi,
      [name]: value,
    }));
  };

  const handleTaxesChange = (index, field, value) => {
    setDevi((prevDevi) => {
      const updatedTaxes = [...prevDevi.taxes];
      updatedTaxes[index] = { ...updatedTaxes[index], [field]: value };
      return { ...prevDevi, taxes: updatedTaxes };
    });
  };

  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    const year = dateObject.getFullYear();
    let month = (1 + dateObject.getMonth()).toString().padStart(2, "0");
    let day = dateObject.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleProductChange = (productId, value, isQuantityChange) => {
    setDevi((prevDevi) => ({
      ...prevDevi,
      items: prevDevi.items.map((item) => {
        if (item.productId === productId) {
          const updatedValue = isQuantityChange ? parseInt(value) : value;
          return {
            ...item,
            [isQuantityChange ? "quantity" : "productId"]: updatedValue,
          };
        }
        return item;
      }),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      let totalAmount = 0;
      let updatedDevi = { ...devi };
      if (devi.items.length > 0) {
        totalAmount = devi.items.reduce(
          (acc, item) =>
            acc +
            (allProductsData.find((product) => product._id === item.productId)
              ?.price || 0) *
              item.quantity,
          0
        );
      }
      if (devi.taxes.length > 0) {
        const taxesAmount = devi.taxes.reduce((acc, item) => {
          const tax = allTaxData.find((taxe) => taxe._id === item.taxId);
          return acc + (tax ? tax.TaksValleur : 0);
        }, 0);
        totalAmount = totalAmount * (1 + taxesAmount / 100);
      }
      updatedDevi = { ...updatedDevi, amount: totalAmount };

      const {data} = await updateDevi({ id, deviData: updatedDevi });
      if(data.success) {
        toast.success("La modification de devi se passe correctement");
        Navigate(`/${userName}/devis`);
      } else {
        toast.error("La modification de devi ne s'est pas réussi");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteProduct = (productId) => {
    setDevi((prevDevi) => ({
      ...prevDevi,
      items: prevDevi.items.filter((item) => item.productId !== productId),
    }));
  };

  const handleDelete = async () => {
    try {
      if(deviData) {
        const {data} = await updateDevi({ id, deviData: { ...deviData, active: false } });
        if(data.success) {
          toast.success("La suppresion de devi se passe correctement");
          Navigate(`/${userName}/devis`);
        } else {
          toast.error("La suppresion de devi ne s'est pas réussi");
        }
      }
      
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteTax = (index) => {
    setDevi((prevDevi) => ({
      ...prevDevi,
      taxes: prevDevi.taxes.filter((_, i) => i !== index),
    }));
  };

  const handleAddItem = () => {
    setDevi((prevDevi) => ({
      ...prevDevi,
      items: [...prevDevi.items, { productId: "", quantity: 0 }],
    }));
  };

  const handleAddTax = () => {
    setDevi((prevDevi) => ({
      ...prevDevi,
      taxes: [...prevDevi.taxes, { taxId: "" }],
    }));
  };

  const handleCancel = () => {
    Navigate(`/${userName}/devis`);
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="MODIFICATION DE DEVIE"
        subtitle="Modification du devi que vous avez sélectionnez"
      />
      <Box m={2} />
      <form onSubmit={handleSubmit}>
        <Card
          elevation={3}
          style={{ borderRadius: 8, padding: "1.5rem", marginBottom: "1.5rem" }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="status-select"
                  value={devi.status || ""}
                  onChange={handleChange}
                  name="status"
                >
                  {["attente d'approbation", "approuvé", "rejeté"].map(
                    (status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date de création"
                type="date"
                name="date"
                value={devi.date ? formatDate(devi.date) : ""}
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
                  value={devi.clientId || ""}
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
              <Typography
                variant="h6"
                fontWeight="bold"
                color={theme.palette.primary[100]}
              >
                <br />
                Produits :<br />
              </Typography>
              {devi.items &&
                devi.items.map((item, index) => (
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
                            item.productId,
                            e.target.value,
                            false
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
                      onChange={(e) =>
                        handleProductChange(
                          item.productId,
                          e.target.value,
                          true
                        )
                      }
                      width={"20%"}
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
              {devi.taxes &&
                devi.taxes.map((item, index) => (
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
            Modifier le devi
          </Button>
          <Button
            onClick={handleDelete}
            aria-label="delete"
            variant="contained"
            color="primary"
            style={{ marginLeft: "1rem" }}
          >
            Supprimer le devi
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
