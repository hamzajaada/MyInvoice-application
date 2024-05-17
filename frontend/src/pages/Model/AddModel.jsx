import React, { useState } from "react";
import { TextField, useTheme, Button, Box, FormControl, InputLabel, Input } from "@mui/material";
import Header from "componentsAdmin/Header";
import {  useAddModelMutation } from "state/api";
import { useNavigate } from "react-router-dom";

const AddModel = () => {
  const [icon, setIcon] = useState(null);
  const navigate = useNavigate()
  if(!localStorage.getItem('userId')) {
    navigate('/');
  }
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  
  const [addModel] = useAddModelMutation();
  const Navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleIconChange = (e) => {
    setIcon(e.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formDataWithLogo = new FormData();
    if (icon) {
      formDataWithLogo.append("icon", icon);
    }
    Object.entries(formData).forEach(([key, value]) => {
      formDataWithLogo.append(key, value); // Enveloppez les données sous la clé 'pack'
    });
    try {
      console.log("model : ", formData);
      console.log("model with icon : ", formDataWithLogo);
      await addModel(formDataWithLogo);
      Navigate("/models");
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <Box m="1.5rem 2.5rem">
      <Header title="ADD MODELS" subtitle="Ajout d'un nouveau model" />
      <form onSubmit={handleSubmit} sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.55rem",
      }} >
        <TextField
          label="Nom de model"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <FormControl fullWidth margin="normal" >
          <InputLabel htmlFor="icon-input" >Icon</InputLabel>
          <Input
            id="icon-input"
            type="file"
            name="icon"
            onChange={handleIconChange}
            accept="image/*"
          />
        </FormControl>
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary">
            Add model
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddModel;
