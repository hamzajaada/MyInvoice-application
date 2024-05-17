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
  Chip,
  Typography,
} from "@mui/material";
import Header from "componentsAdmin/Header";
import { useGetAllCategoriesQuery, useAddProduitMutation } from "state/api";
import { useNavigate } from "react-router-dom";

const AddProduit = () => {
  const navigate = useNavigate();
  if (!localStorage.getItem("userId")) {
    navigate("/");
  }
  const theme = useTheme();
  const [produit, setProduit] = useState({
    userId: localStorage.getItem("userId") || "",
    categoryId: "",
    name: "",
    description: "",
    quantity: 0,
    price: 0,
  });
  const [AddProduit] = useAddProduitMutation();
  const id = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const { data: categorieData } = useGetAllCategoriesQuery(id);
  const Navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduit({ ...produit, [name]: name === "quantity" || name === "price" ? parseFloat(value) : value });
  };

  const handleCategoryChange = (event) => {
    setProduit({ ...produit, categoryId: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(produit);
      await AddProduit({ produit });
      Navigate(`/${userName}/produits`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="AJOUTE DE PRODUCT" subtitle="Ajout d'un nouveau produit" />
      <form
        onSubmit={handleSubmit}
        sx={{
          backgroundImage: "none",
          backgroundColor: theme.palette.background.alt,
          borderRadius: "0.55rem",
        }}
      >
        <TextField
          label="Nom de produit"
          name="name"
          value={produit.name}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={produit.description}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Prix"
          name="price"
          type="number"
          value={produit.price}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Quantity"
          name="quantity"
          type="number"
          value={produit.quantity}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="categories-label">Catégorie</InputLabel>
          <Select
            labelId="categories-label"
            id="category-select"
            value={produit.categoryId}
            onChange={handleCategoryChange}
            renderValue={(selected) => (
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {selected && (
                  <Typography>
                    {
                      categorieData.find((category) => category._id === selected)?.categoryName || ""
                    }
                  </Typography>
                )}
              </div>
            )}
          >
            {categorieData &&
              categorieData.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.categoryName}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary">
            Ajouter
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddProduit;
