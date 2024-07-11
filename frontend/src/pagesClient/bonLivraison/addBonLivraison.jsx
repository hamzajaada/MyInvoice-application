import React, { useState } from "react";
import {
  TextField,
  useTheme,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import Header from "componentsAdmin/Header";
import { toast } from "react-toastify";
import { useAddBonLivraisonMutation, useGetBonCommandesQuery } from "state/api";
import { useNavigate } from "react-router-dom";

const AddBonLivraison = () => {
  const navigate = useNavigate();

  if (!localStorage.getItem("userId")) {
    navigate("/");
  }
  const theme = useTheme();
  const id = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const [bonLivraison, setBonLivraison] = useState({
    userId: localStorage.getItem("userId") || "",
    bonCommandeId: "",
    dateLivraison: new Date(),
    amount: 0,
  });
  const [AddBonLivraison] = useAddBonLivraisonMutation();
  const { data:  bonCommandesData } = useGetBonCommandesQuery(id);

  const Navigate = useNavigate();

  const handleChange = (e) => {
    setBonLivraison({ ...bonLivraison, [e.target.name]: e.target.value });
  };



  const handleBonCommandeChange = (event) => {
    setBonLivraison({ ...bonLivraison, bonCommandeId: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const bonCommandeId = bonLivraison.bonCommandeId;
      const bonCommandeDetails = bonCommandesData.find(
        (bonCommande) => bonCommande._id === bonCommandeId
      );
      if (bonCommandeDetails) {
        const amount = bonCommandeDetails.amount;
        console.log('amount : ', amount);
        const {data} = await AddBonLivraison({ bonLivraison: { ...bonLivraison, amount } });
        if (data.success) {
          toast.success("Bon de livraison ajouté avec succès");
          Navigate(`/${userName}/bon-livraison`);
        } else {
          toast.error("Le bon de livraison ne pas ajouté avec succès");
        }
        
      } else {
        console.error("Détails de la livraison non trouvés.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
    <Header title="AJOUTER DES BON DE LIVRAISON" subtitle="Ajout d'un nouvelle bon de livraison" />
    <Box m="1.5rem auto" fullWidth border={`2px solid ${theme.palette.primary.main}`} borderRadius="0.5rem" p="1rem">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Date de livraison"
              name="dateLivraison"
              type="date"
              value={bonLivraison.dateLivraison}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="client-label">Sélectionnez un bon de commande</InputLabel>
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
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Ajouter le bon de livraison
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  </Box>
  );
};

export default AddBonLivraison;