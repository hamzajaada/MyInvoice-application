import React, { useState, useEffect } from "react";
import { TextField, useTheme, Button, Box } from "@mui/material";
import Header from "componentsAdmin/Header";
import { useUpdateTaxMutation, useGetOneTaxQuery, useRemoveTaksMutation } from "state/api";
import { useNavigate, useParams } from "react-router-dom";

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
  const [removeTax] = useRemoveTaksMutation();

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
      await removeTax(id);
      navigate(`/${userName}/Taks`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(tax);
      await editTax({ id, taxData: tax });
      navigate(`/${userName}/Taks`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="MODIFICATION DE TAX" subtitle="Modification dec tax séléctionné" />
      <form onSubmit={handleSubmit} sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.55rem",
      }} >
        <TextField
          label="Nom de tax"
          name="name"
          value={tax.name}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
        label="Taks Valleur"
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
            Modifier le tax
          </Button>
          <Button type="button" onClick={handleDelete} aria-label="delete" sx={{ ml: 2 }} variant="contained" color="primary">
            Supprimer le tax
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditCategorie;

