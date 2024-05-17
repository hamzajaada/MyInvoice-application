import React, { useState } from "react";
import { TextField, useTheme, Button, Box } from "@mui/material";
import Header from "componentsAdmin/Header";
import { useAddFournisseurMutation } from "state/api";
import { useNavigate } from "react-router-dom";

const AddFournisseur = () => {
  const navigate = useNavigate()
  if(!localStorage.getItem('userId')) {
    navigate('/');
  }
  const theme = useTheme();
  const [fournisseur, setFournisseur] = useState({
    userId: localStorage.getItem("userId") || "",
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [addFournisseurs] = useAddFournisseurMutation();
  const Navigate = useNavigate();
  const userName = localStorage.getItem("userName");

  const handleChange = (e) => {
    setFournisseur({ ...fournisseur, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(fournisseur);
      await addFournisseurs({ fournisseur });
      Navigate(`/${userName}/fournisseurs`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="AJOUTER UN FOURNISSEUR" subtitle="Ajout d'un nouveau fournisseurs" />
      <form onSubmit={handleSubmit} sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.55rem",
      }} >
        <TextField
          label="Nom de fournisseur"
          name="name"
          value={fournisseur.name}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          value={fournisseur.email}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Phone number"
          name="phone"
          type="text"
          value={fournisseur.phone}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Address"
          name="address"
          type="text"
          value={fournisseur.address}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary">
            Ajouter un fournisseur
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddFournisseur;

