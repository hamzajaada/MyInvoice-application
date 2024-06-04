import React, { useState, useEffect } from "react";
import {
  TextField,
  useTheme,
  Button,
  Box,
  FormControl,
  InputLabel,
  Input,
} from "@mui/material";
import Header from "componentsAdmin/Header";
import {
  useGetOneModelQuery,
  useUpdateModelMutation,
  useUpdateModelActiveMutation,
} from "state/api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditModel = () => {
  const navigate = useNavigate();
  if (!localStorage.getItem("userId")) {
    navigate("/");
  }
  const theme = useTheme();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState([]);
  const { id } = useParams();
  const { data: model } = useGetOneModelQuery(id);
  const [updateModel] = useUpdateModelMutation();
  const [updateModelActive] = useUpdateModelActiveMutation();
  const Navigate = useNavigate();

  useEffect(() => {
    if (model) {
      setName(model.name);
      setDescription(model.description);
      setIcon({
        public_id: model.icon.public_id,
        url: model.icon.url,
      });
    }
  }, [model]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        "Le fichier est trop volumineux. La taille maximale autorisée est de 5MB."
      );
      console.log(
        "Le fichier est trop volumineux. La taille maximale autorisée est de 5MB."
      );
      return;
    }
    setIcon(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("userId", localStorage.getItem("userId"));
    formData.append("name", name);
    formData.append("description", description);
    if (icon instanceof File) {
      formData.append("icon", icon);
    } else {
      formData.append("icon", JSON.stringify(icon));
    }
    try {
      const { data } = await updateModel({ id, model: formData });
      if (data.success) {
        toast.success("Modèle modifié avec succès");
        Navigate("/models");
      } else {
        toast.error("Le modèle ne pas modifié avec succès");
      }
    } catch (error) {
      toast.error("Erreur lors de la modification de model");
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      if (model) {
        const newModel = { ...model, active: false };
        console.log(newModel);
        try {
          const { data } = await updateModelActive({ id, model: newModel });
          if (data.success) {
            toast.success("Modèle supprimé avec succès");
            Navigate("/models");
          } else {
            toast.error(
              "Le modèle ne pas supprimé avec succès");
          }
        } catch (error) {
          toast.error(
            "Erreur lors de la suppression de model");
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="MODIFICATIONS DE MODELS"
        subtitle="Modification de model selectionné"
      />
      <form
        onSubmit={handleSubmit}
        sx={{
          backgroundImage: "none",
          backgroundColor: theme.palette.background.alt,
          borderRadius: "0.55rem",
        }}
      >
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
        <FormControl fullWidth margin="normal">
          <InputLabel htmlFor="icon-input">Icon</InputLabel>
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
            Modifier le model
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            aria-label="delete"
            sx={{ ml: 2 }}
            variant="contained"
            color="primary"
          >
            Supprimer le model
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditModel;
