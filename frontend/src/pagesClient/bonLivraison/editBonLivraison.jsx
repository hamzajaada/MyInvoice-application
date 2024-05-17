import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Grid,
  Card,
} from "@mui/material";
import Header from "componentsAdmin/Header";
import {
  useGetOneBonLivraisonQuery,
  useUpdateBonLivraisonMutation,
  useRemoveBonLivraisonMutation,
  useGetBonCommandesQuery,
} from "state/api";
import { useParams, useNavigate } from "react-router-dom";

const EditInvoice = () => {
  const Navigate = useNavigate();
  if (!localStorage.getItem("userId")) {
    Navigate("/");
  }
  const { id } = useParams();
  const [bonLivraison, setBonLivraison] = useState({
    userId: localStorage.getItem("userId") || "",
    bonCommandeId: "",
    dateLivraison: new Date(),
    status: "",
    amount: 0,
  });
  // const [bonCommande, setBonCommande] = useState([]);

  const { data: bonLivraisonData } = useGetOneBonLivraisonQuery(id);
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const { data:  bonCommandesData } = useGetBonCommandesQuery(userId);

  useEffect(() => {
    if (bonLivraisonData) {
      setBonLivraison(bonLivraisonData);
    }
  }, [bonLivraisonData]);

  const [updateBonLivraison] = useUpdateBonLivraisonMutation();
  const [removeBonLivraison] = useRemoveBonLivraisonMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBonLivraison((prevBonLivraison) => ({
      ...prevBonLivraison,
      [name]: value,
    }));
  };

  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    const year = dateObject.getFullYear();
    let month = (1 + dateObject.getMonth()).toString().padStart(2, "0");
    let day = dateObject.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      let updatedBonLivraison = { ...bonLivraison };
      const bonCommandeId = bonLivraison.bonCommandeId;
      const bonCommandeDetails = bonCommandesData.find(
        (bonCommande) => bonCommande._id === bonCommandeId
      );
      if(bonCommandeDetails) {
        const amount = bonCommandeDetails.amount;
        updatedBonLivraison = { ...updatedBonLivraison, amount: amount };
      } else {
        updatedBonLivraison = { ...updatedBonLivraison, amount: 0 };
      }
      console.log(updatedBonLivraison);
      await updateBonLivraison({ id, BonLivraisonData: updatedBonLivraison });
      Navigate(`/${userName}/bon-livraison`);
    } catch (error) {
      console.log(error);
    }
  };


  const handleDelete = async () => {
    try {
      await removeBonLivraison(id);
      Navigate(`/${userName}/bon-livraison`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBonCommandeChange = (event) => {
    setBonLivraison({ ...bonLivraison, bonCommandeId: event.target.value });
  };


  const handleCancel = () => {
    Navigate(`/${userName}/bon-livraison`);
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="MODIFICATION DU BON DE LIVRAISON" subtitle="Modification de le bon de livraison que vous avez sélectionnez"/>
      <Box m={2} />
      <form onSubmit={handleSubmit}>
      <Card elevation={3} style={{ borderRadius: 8, padding: "1.5rem", marginBottom: "1.5rem" }}>
        <Grid container spacing={2}>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status-select"
                value={bonLivraison.status || ""}
                onChange={handleChange}
                name="status"
              >
                {["attent de confirmation", "confirmé", "attent de reception"].map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date de création"
              type="date"
              name="date"
              value={bonLivraison.dateLivraison ? formatDate(bonLivraison.dateLivraison) : ""}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="client-label">Bon de commande</InputLabel>
              <Select
                labelId="client-label"
                id="client-select"
                value={bonLivraison.bonCommandeId}
                onChange={handleBonCommandeChange}
                fullWidth
                required
              >
                {bonCommandesData &&
                  bonCommandesData.map((bon_commande) => (
                    <MenuItem key={bon_commande._id} value={bon_commande._id}>
                      {bon_commande._id}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        </Card>
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button type="submit" variant="contained" color="primary">
            Modifier le bon de livraison
          </Button>
          <Button
            onClick={handleDelete}
            aria-label="delete"
            variant="contained"
            color="primary"
            style={{ marginLeft: "1rem" }}
          >
            Supprimer le bon de livraison
          </Button>
          </Box>
          <Box mt={2} display="flex" justifyContent="flex-end">
          <Button
            onClick={handleCancel}
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

export default EditInvoice;