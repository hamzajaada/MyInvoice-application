import React, { useState, useEffect } from "react";
import { TextField, Box, Button, useTheme } from "@mui/material";
import Header from "componentsAdmin/Header";
import { useUpdateServiceMutation, useGetOneServiceQuery } from "state/api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditService = () => {
  const navigate = useNavigate()
  if(!localStorage.getItem('userId')) {
    navigate('/');
  }
  const [serviceName, setServiceName] = useState("");
  const [active, setActive] = useState(true)
  const [updateService] = useUpdateServiceMutation();
  const { id } = useParams();
  const { data: serviceData } = useGetOneServiceQuery(id);
  const theme = useTheme();

  useEffect(() => {
    if (serviceData) {
      setServiceName(serviceData.ServiceName);
      setActive(serviceData.active);
    }
  }, [serviceData]);

  const handleChange = (e) => {
    setServiceName(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await updateService({ id, ServiceData: { ServiceName: serviceName, active: active } });
      if(data.success) {
        toast.success("Service modifié avec succès");
        navigate("/Services");
      } else {
        toast.error("Le service ne pas modifié avec succès");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      if(active) {
        setActive(false)
        const {data} = await updateService({ id, ServiceData: { ServiceName: serviceName, active: active } });
        if(data.success) {
          toast.success("Service supprimé avec succès");
          navigate("/Services");
        } else {
          toast.error("Le service ne pas supprimé avec succès");
        }
      }
      
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="MODIFIER SERVICE" subtitle="Modification d'une service" />
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
          Modification de service
          </Button>
          <Button type="submit" onClick={handleDelete} aria-label="delete" sx={{ ml: 2 }} variant="contained" color="primary">
            Suppression de service
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditService;
