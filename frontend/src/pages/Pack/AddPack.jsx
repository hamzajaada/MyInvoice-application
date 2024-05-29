import React, { useState } from "react";
import {
  TextField,
  useTheme,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  Typography,
  MenuItem,
  Chip,
  Input,
} from "@mui/material";
import Header from "componentsAdmin/Header";
import { useGetAllServicesQuery, useAddPackMutation } from "state/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddPack = () => {
  const navigate = useNavigate();
  if (!localStorage.getItem("userId")) {
    navigate("/");
  }
  const theme = useTheme();
  const [logo, setLogo] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [services, setServices] = useState([]);
  const [price, setPrice] = useState(0);
  const [addPack] = useAddPackMutation();
  const { data: servicesData } = useGetAllServicesQuery();

  const handleServiceChange = (event) => {
    setServices(event.target.value);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setFileToBase(file);
  };

  const setFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setLogo(reader.result);
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formattedServices = services.map((serviceId) => ({ serviceId }));
    const pack = {
      name,
      description,
      price,
      services: formattedServices,
      logo,
    };
    try {
      const { data } = await addPack(pack);
      if (data.success) {
        toast.success("L'enregistrement de pack s'est bien passé");
        navigate("/packadmin");
      } else {
        toast.error(
          "L'enregistrement de pack ne s'est pas passé correctement : " +
            data.message
        );
        console.log(data.error);
      }
    } catch (error) {
      toast.error("Erreur lors de l'ajoute de pack : " + error.message);
      console.log(error);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="AJOUTE DE PACK" subtitle="Ajout d'un nouveau pack" />
      <form
        onSubmit={handleSubmit}
        sx={{
          backgroundImage: "none",
          backgroundColor: theme.palette.background.alt,
          borderRadius: "0.55rem",
        }}
      >
        <TextField
          label="Nom de pack"
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
        <TextField
          label="Prix"
          name="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="services-label">Services</InputLabel>
          <Select
            labelId="services-label"
            id="services"
            multiple
            value={services}
            onChange={handleServiceChange}
            renderValue={(selected) => (
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {selected.map((serviceId) => {
                  const service = servicesData.find(
                    (service) => service._id === serviceId
                  );
                  return <Chip key={serviceId} label={service?.ServiceName} />;
                })}
              </div>
            )}
          >
            {servicesData &&
              servicesData.map((service) => (
                <MenuItem key={service._id} value={service._id}>
                  {service.ServiceName}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <Typography
            variant="body1"
            component="label"
            htmlFor="icon-input"
            sx={{ display: "block", marginBottom: "0.5rem" }}
          >
            Icon
          </Typography>
          <Input
            id="icon-input"
            type="file"
            name="icon"
            onChange={handleImage}
            accept="image/*"
            sx={{
              display: "block",
              padding: "10px 14px",
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: "4px",
              cursor: "pointer",
            }}
          />
        </FormControl>
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary">
          Ajout de pack
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddPack;
