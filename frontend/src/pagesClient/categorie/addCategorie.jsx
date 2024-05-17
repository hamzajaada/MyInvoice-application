import React, { useState } from "react";
import { TextField, useTheme, Button, Box } from "@mui/material";
import Header from "componentsAdmin/Header";
import { useAddCategoryMutation } from "state/api";
import { useNavigate } from "react-router-dom";

const AddClient = () => {
  const navigate = useNavigate()
  if(!localStorage.getItem('userId')) {
    navigate('/');
  }
  const theme = useTheme();
  const userName = localStorage.getItem("userName");
  const [categorie, setCategorie] = useState({
    userId: localStorage.getItem("userId") || "",
    categoryName: "",
  });
  const [addCategorie] = useAddCategoryMutation();
  const Navigate = useNavigate();

  const handleChange = (e) => {
    setCategorie({ ...categorie, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(categorie);
      await addCategorie({ categorie });
      Navigate(`/${userName}/categories`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="ADD CATEGORIES" subtitle="Ajout d'un nouveau catégorie" />
      <form onSubmit={handleSubmit} sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.55rem",
      }} >
        <TextField
          label="Categorie"
          name="categoryName"
          value={categorie.categoryName}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary">
            Ajouter
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddClient;

