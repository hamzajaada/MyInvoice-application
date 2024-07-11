import React, { useState, useEffect } from "react";
import { TextField, useTheme, Button, Box } from "@mui/material";
import Header from "componentsAdmin/Header";
import { useUpdateTaxMutation, useGetOneTaxQuery } from "state/api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditCategorie = () => {
  const navigate = useNavigate()
  if(!localStorage.getItem('userId')) {
    navigate('/');
  }
  const userName = localStorage.getItem("userName");
  const theme = useTheme();
  const [tax, setTax] = useState({
    userId: localStorage.getItem("userId") || "",
    name:"",
    TaksValleur : 0,
  });
  const {id} = useParams();
  const {data : taxData} = useGetOneTaxQuery(id);
  const [editTax] = useUpdateTaxMutation();

  useEffect(() => {
    if (taxData) {
      setTax(taxData);
    }
  }, [taxData]);

  const handleChange = (e) => {
    setTax({ ...tax, [e.target.name]: e.target.value });
  };

  const handleDelete = async () => {
    try {
      if(taxData) {
        const {data} = await editTax({ id, taxData: { ...taxData, active: false } });
        if(data.success) {
          toast.success("Le Taxe a été supprimé avec succès");
          navigate(`/${userName}/Taks`);
        } else {
          toast.error("La Suppresion du Taxe a échoué ");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(tax);
      const {data} = await editTax({ id, taxData: tax });
      if(data.success) {
        toast.success("Le Taxe a été modifié avec succès");
        navigate(`/${userName}/Taks`);
      } else {
        toast.error("La Modification du Taxe a échoué");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="MODIFICATION DU TAXE" subtitle="Modification Du Taxe Sélectionné" />
      <Box m={4}/>
      <form onSubmit={handleSubmit} sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.55rem",
      }} >
        <TextField
          label="Nom du Taxe"
          name="name"
          value={tax.name}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
        label="Valeur du Taxe"
        name="TaksValleur"
        value={tax.TaksValleur} 
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
        type="number" // Ensure the input is a number
      />
        <Box mt={2}>
        <Button type="submit" variant="contained" color="primary">
            Modifier le taxe
          </Button>
          <Button type="button" onClick={handleDelete} aria-label="delete" sx={{ ml: 2 }} variant="contained" color="primary">
            Supprimer le taxe
          </Button>
        </Box>
        <Box mt={2} display="flex" justifyContent="left">
            <Button
              onClick={() => navigate(-1)}
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

export default EditCategorie;

