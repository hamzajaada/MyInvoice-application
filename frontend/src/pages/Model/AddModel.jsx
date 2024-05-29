import React, { useState } from "react";
import { TextField, useTheme, Button, Box, FormControl, InputLabel, Input } from "@mui/material";
import Header from "componentsAdmin/Header";
import {  useAddModelMutation } from "state/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddModel = () => {
  
  const navigate = useNavigate()
  if(!localStorage.getItem('userId')) {
    navigate('/');
  }
  const theme = useTheme();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState([]);
  const [addModel] = useAddModelMutation();
  const Navigate = useNavigate();

  const handleImage = (e) => {
    const file = e.target.files[0];
    setFileToBase(file);
  };

  const setFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setIcon(reader.result);
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const model = {
      userId: localStorage.getItem("userId"),
      name,
      description,
      icon,
    };
    try {
      const { data } = await addModel(model);
      if (data.success) {
        toast.success("L'enregistrement de model se passe correctement");
        Navigate("/models");
      } else {
        toast.error(
          "L'enregistrement de model ne s'est pas passé correctement : " + data.error
        );
      }
    } catch (error) {
      toast.error("Erreur lors de l'ajoute de model : " + error.message);
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
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
            onChange={handleImage}
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
