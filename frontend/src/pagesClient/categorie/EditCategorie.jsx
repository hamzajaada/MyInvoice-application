import React, { useState, useEffect } from "react";
import { TextField, useTheme, Button, Box } from "@mui/material";
import Header from "componentsAdmin/Header";
import { useUpdateCategorieMutation, useGetOneCategorieQuery } from "state/api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditCategorie = () => {
  const navigate = useNavigate()
  if(!localStorage.getItem('userId')) {
    navigate('/');
  }
  const userName = localStorage.getItem("userName");
  const theme = useTheme();
  const [categorie, setCategorie] = useState({
    categoryName: "",
  });
  const {id} = useParams();
  console.log("id  : ", id)
  const {data : categorieData} = useGetOneCategorieQuery(id);
  const [editCategorie] = useUpdateCategorieMutation();

  useEffect(() => {
    if (categorieData) {
      setCategorie(categorieData);
    }
  }, [categorieData]);

  const handleChange = (e) => {
    setCategorie({ ...categorie, [e.target.name]: e.target.value });
  };

  const handleDelete = async () => {
    try {
      if(categorieData) {
        const newCategorie = {...categorieData, active: false}
        const {data} = await editCategorie({id, categorie: newCategorie});
        if(data.success) {
          toast.success("La suppresion de catégorie se passe correctement");
          navigate(`/${userName}/categories`);
        } else {
          toast.error("La suppresion de catégorie ne s'est pas réussie");
        }
      }
      
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(categorie);
      const {data} = await editCategorie({ id, categorie });
      if(data.success) {
        toast.success("La modification de catégorie se passe correctement");
        navigate(`/${userName}/categories`);
      } else {
        toast.error("La modification de catégorie ne s'est pas réussie");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="MODIFICATION DU CATEGORIE" subtitle="Modification de catégorie séléctionné" />
      <form onSubmit={handleSubmit} sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.55rem",
      }} >
        <TextField
          label="Nom de catégorie"
          name="categoryName"
          value={categorie.categoryName}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <Box mt={2}>
        <Button type="submit" variant="contained" color="primary">
            Modifier la catégorie
          </Button>
          <Button type="button" onClick={handleDelete} aria-label="delete" sx={{ ml: 2 }} variant="contained" color="primary">
            Supprimer la catégorie
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditCategorie;

