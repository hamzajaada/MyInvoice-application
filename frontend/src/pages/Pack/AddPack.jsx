import React, { useState } from "react";
import { TextField, useTheme, Button, Box, FormControl, InputLabel, Select,Typography,  MenuItem, Chip, Input } from "@mui/material";
import Header from "componentsAdmin/Header";
import {  useGetAllServicesQuery, useAddPackMutation } from "state/api";
import { useNavigate } from "react-router-dom";

const AddPack = () => {
  const [logo, setLogo] = useState(null);
  const navigate = useNavigate()
  if(!localStorage.getItem('userId')) {
    navigate('/');
  }
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    services: [],
    price: 0,
  });
  
  const [addPack] = useAddPackMutation();
  const { data: servicesData } = useGetAllServicesQuery();
  const Navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleServiceChange = (event) => {
    const selectedServices = event.target.value;
    setFormData({ ...formData, services: selectedServices });
  };

  const handleIconChange = (e) => {
    setLogo(e.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formDataWithLogo = new FormData();
    if (logo) {
      formDataWithLogo.append("logo", logo);
    }
    Object.entries(formData).forEach(([key, value]) => {
      formDataWithLogo.append(key, value); 
    });
    try {
      await addPack(formDataWithLogo);
      
      Navigate("/packadmin");
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <Box m="1.5rem 2.5rem">
      <Header title="ADD PACK" subtitle="Ajout d'un nouveau pack" />
      <form onSubmit={handleSubmit} sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.55rem",
      }} >
        <TextField
          label="Nom de pack"
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
        <TextField
          label="Prix"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
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
            value={formData.services}
            onChange={handleServiceChange}
            renderValue={(selected) => (
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {selected.map((serviceId) => (
                  <Chip key={serviceId} label={servicesData.find(service => service._id === serviceId)?.ServiceName} />
                ))}
              </div>
            )}
          >
            {servicesData && servicesData.map((service) => (
              <MenuItem key={service._id} value={service._id}>
                {service.ServiceName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* <FormControl fullWidth margin="normal" >
          <InputLabel htmlFor="icon-input" >Icon</InputLabel>
          <Input
            id="icon-input"
            type="file"
            name="icon"
            onChange={handleIconChange}
            accept="image/*"
          />
        </FormControl> */}
        <FormControl fullWidth margin="normal">
          <Typography variant="body1" component="label" htmlFor="icon-input" sx={{ display: 'block', marginBottom: '0.5rem' }}>
            Icon
          </Typography>
          {/* <InputLabel htmlFor="icon-input" >Icon</InputLabel> */}
          <Input
            id="icon-input"
            type="file"
            name="icon"
            onChange={handleIconChange}
            accept="image/*"
            sx={{
              display: 'block',
              padding: '10px 14px',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          />
        </FormControl>
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary">
            Add pack
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddPack;
