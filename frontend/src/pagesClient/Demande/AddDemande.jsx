import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useGetPacksQuery, useAddDemandeMutation } from "state/api";
import Header from "componentsAdmin/Header";

const Profil = () => {
  const navigate = useNavigate();
  if (!localStorage.getItem("userId")) {
    navigate("/");
  }
  const id = localStorage.getItem("userId");
  const theme = useTheme();
  const [AddDemande] = useAddDemandeMutation();
  const [Allpack, setAllPack] = useState([]);
  const [demande, setDemande] = useState({
    userId: id,
    packId: "",
    nombreAnnee: 0,
    status: "en attent",
    amount: 0,
  });

  // hadi
  const { data: packData } = useGetPacksQuery();

  useEffect(() => {
    if (packData) {
      setAllPack(packData);
    }
  }, [packData]);

  const handlePackChange = (event) => {
    setDemande({ ...demande, packId: event.target.value });
  };

  const handleFieldChange = (field, value) => {
    setDemande((prevDemande) => ({
      ...prevDemande,
      [field]: value,
    }));
  };

  const handleNombreAnneeChange = (event) => {
    setDemande({ ...demande, nombreAnnee: Number(event.target.value) });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const packSelect = packData.find((pack) => pack._id === demande.packId);
      const amount = packSelect.price * demande.nombreAnnee;
      const updatedDemande = { ...demande, amount: amount };
      setDemande(updatedDemande);
      console.log(updatedDemande);
      const res = await AddDemande(updatedDemande);
      console.log(res)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box m="2rem 2.5rem">
      <Header
        title="CHANGEMENT DE PACK"
        subtitle="Demande de chamngement de pack"
      />
      <form
        onSubmit={handleSubmit}
        sx={{
          backgroundImage: "none",
          backgroundColor: theme.palette.background.alt,
          borderRadius: "0.55rem",
        }}
      >
        <FormControl fullWidth margin="normal">
          <InputLabel id="categories-label">Pack</InputLabel>
          <Select
            labelId="categories-label"
            id="category-select"
            value={demande.packId}
            onChange={handlePackChange}
            renderValue={(selected) => (
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {selected && (
                  <Typography>
                    {Allpack.find((pack) => pack._id === selected)?.name || ""}
                  </Typography>
                )}
              </div>
            )}
          >
            {Allpack &&
              Allpack.map((pack) => (
                <MenuItem key={pack._id} value={pack._id}>
                  {pack.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel id="status-label">Nombre d'année</InputLabel>
          <Select
            labelId="status-label"
            id="status-select"
            value={demande.nombreAnnee || ""}
            onChange={handleNombreAnneeChange}
            name="status"
          >
            {[1, 2, 3, 4].map((annee) => (
              <MenuItem key={annee} value={annee}>
                {`${annee} année${annee > 1 ? "s" : ""}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary">
            Envoyer la demande
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Profil;
