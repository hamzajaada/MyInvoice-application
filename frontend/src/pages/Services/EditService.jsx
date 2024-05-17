import React, { useState, useEffect } from "react";
import { TextField, Box, Button, useTheme } from "@mui/material";
import Header from "componentsAdmin/Header";
import { useUpdateServiceMutation, useGetOneServiceQuery, useRemoveServiceMutation } from "state/api";
import { useNavigate, useParams } from "react-router-dom";

const EditService = () => {
  const navigate = useNavigate()
  if(!localStorage.getItem('userId')) {
    navigate('/');
  }
  const [serviceName, setServiceName] = useState("");
  const [updateService] = useUpdateServiceMutation();
  const [removeService] = useRemoveServiceMutation();
  const { id } = useParams();
  const Navigate = useNavigate();
  const { data: serviceData } = useGetOneServiceQuery(id);
  const theme = useTheme();

  useEffect(() => {
    if (serviceData) {
      setServiceName(serviceData.ServiceName);
    }
  }, [serviceData]);

  const handleChange = (e) => {
    setServiceName(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateService({ id, ServiceData: { ServiceName: serviceName } });
      Navigate("/Services");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      await removeService(id);
      Navigate("/Services");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="EDIT SERVICES" subtitle="Modification d'une service" />
      <form onSubmit={handleSubmit} sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.55rem",
      }}>
        <TextField
          label="Service Name"
          value={serviceName}
          name="ServiceName"
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary">
            Edit Service
          </Button>
          <Button type="submit" onClick={handleDelete} aria-label="delete" sx={{ ml: 2 }} variant="contained" color="primary">
            Delete Service
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditService;
