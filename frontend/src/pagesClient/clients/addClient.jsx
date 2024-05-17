import React, { useState } from "react";
import { TextField, useTheme, Button, Box } from "@mui/material";
import Header from "componentsAdmin/Header";
import { useAddClientMutation } from "state/api";
import { useNavigate } from "react-router-dom";

const AddClient = () => {
  const navigate = useNavigate()
  if(!localStorage.getItem('userId')) {
    navigate('/');
  }
  const userName = localStorage.getItem("userName");
  const theme = useTheme();
  const [client, setClient] = useState({
    userId: localStorage.getItem("userId") || "",
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [addClient] = useAddClientMutation();
  const Navigate = useNavigate();

  const handleChange = (e) => {
    setClient({ ...client, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(client);
      await addClient({ client });
      Navigate(`/${userName}/clients`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="AJOUTE DE CLIENT" subtitle="Ajout d'un nouveau client" />
      <form onSubmit={handleSubmit} sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.55rem",
      }} >
        <TextField
          label="Nom de client"
          name="name"
          value={client.name}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          type="email"
          label="Email"
          name="email"
          value={client.email}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Phone number"
          name="phone"
          type="text"
          value={client.phone}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Address"
          name="address"
          type="text"
          value={client.address}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary">
            Add client
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddClient;

