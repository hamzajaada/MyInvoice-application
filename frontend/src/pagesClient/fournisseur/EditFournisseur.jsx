import React, { useState, useEffect } from "react";
import { TextField, useTheme, Button, Box } from "@mui/material";
import Header from "componentsAdmin/Header";
import { useUpdateFournisseurMutation, useGetOneFournisseurQuery, useRemoveFournisseurMutation } from "state/api";
import { useNavigate, useParams } from "react-router-dom";

const EditFournisseur = () => {
  const navigate = useNavigate()
  if(!localStorage.getItem('userId')) {
    navigate('/');
  }
  const theme = useTheme();
  const [fournisseur, setFournisseur] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const {id} = useParams();
  const {data : fournisseurData} =useGetOneFournisseurQuery(id);
  const [editFournisseur] = useUpdateFournisseurMutation();
  const [removeFournisseur] = useRemoveFournisseurMutation();
  const userName = localStorage.getItem("userName");

  useEffect(() => {
    if (fournisseurData) {
      setFournisseur(fournisseurData);
    }
  }, [fournisseurData]);

  const handleChange = (e) => {
    setFournisseur({ ...fournisseur, [e.target.name]: e.target.value });
  };

  const handleDelete = async () => {
    try {
      await removeFournisseur(id);
      navigate(`/${userName}/fournisseurs`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(fournisseur);
      await editFournisseur({ id, fournisseur });
      navigate(`/${userName}/fournisseurs`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="MODIFICATION DU FOURNISSEU" subtitle="modification d'un fournisseur" />
      <form onSubmit={handleSubmit} sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.55rem",
      }} >
        <TextField
          label="Nom de client"
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
            Modifier le fournisseur
          </Button>
          <Button type="button" onClick={handleDelete} aria-label="delete" sx={{ ml: 2 }} variant="contained" color="primary">
            Supprimer le fournisseur
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditFournisseur;

