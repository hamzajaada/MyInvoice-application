import React, { useState, useEffect } from "react";
import { TextField, useTheme, Button, Box } from "@mui/material";
import Header from "componentsAdmin/Header";
import { useUpdateClientMutation, useGetOneClientQuery } from "state/api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditClient = () => {
  const navigate = useNavigate()
  if(!localStorage.getItem('userId')) {
    navigate('/');
  }
  const theme = useTheme();
  const [client, setClient] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const {id} = useParams();
  const {data : clientData} =useGetOneClientQuery(id);
  const [editClient] = useUpdateClientMutation();
  const userName = localStorage.getItem("userName");

  useEffect(() => {
    if (clientData) {
      setClient(clientData);
    }
  }, [clientData]);

  const handleChange = (e) => {
    setClient({ ...client, [e.target.name]: e.target.value });
  };

  const handleDelete = async () => {
    try {
      if(clientData) {
        const newClient = {...clientData, active: false}
        const {data} = await editClient({id, client: newClient});
        if(data.success) {
          toast.success("La suppresion de client se passe correctement");
          navigate(`/${userName}/clients`);
        } else {
          toast.error("La suppresion de client ne s'est pas réussie");
        }
      }
      
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(client);
      const {data} = await editClient({ id, client });
      if(data.success) {
        toast.success("La modification de client se passe correctement");
        navigate(`/${userName}/clients`);
      } else {
        toast.error("La modification de client ne s'est pas réussie");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="MODIFICATION DE CLIENT" subtitle="Modification de client séléctionné" />
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
            Modifier le client
          </Button>
          <Button type="button" onClick={handleDelete} aria-label="delete" sx={{ ml: 2 }} variant="contained" color="primary">
            Supprimer le client
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditClient;

