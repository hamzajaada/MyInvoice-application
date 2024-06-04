import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  useTheme,
  Typography,
  Grid,
  Paper,
  Avatar,
  useMediaQuery,
  Divider,
} from "@mui/material";
import { useGetEntrepriseDetailQuery } from "state/api";
import Header from "componentsAdmin/Header";
import FlexBetween from "componementClient/FlexBetween";

const EnterpriseDetails = () => {
  const navigate = useNavigate();
  if (!localStorage.getItem("userId")) {
    navigate("/");
  }

  const [enterpriseDetails, setEnterpriseDetails] = useState({});
  const theme = useTheme();
  const { id } = useParams();
  const { data, isLoading } = useGetEntrepriseDetailQuery(id);
  const isScreenSmall = useMediaQuery("(max-width:900px)");

  useEffect(() => {
    if (data) {
      setEnterpriseDetails(data);
    }
  }, [data]);

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  const {
    name,
    email,
    phone,
    address,
    logo,
    subscriptionStatue,
    subscriptionStartDate,
    subscriptionEndDate,
    pack,
    price,
    nombreFournisseur,
    nombreClient,
    nombreDocument,
  } = enterpriseDetails;

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="Entreprise Detail"
        subtitle="Les détails de l'entreprise"
      />
      <Grid container spacing={4} mt="40px">
        <Grid item xs={12} sm={6} md={12}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              transition: "transform 0.3s",
              "&:hover": { transform: "scale(1.05)" },
            }}
          >
            <Typography
              variant="h6"
              color={theme.palette.secondary[100]}
              gutterBottom
            >
              Détails de l'entreprise
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {isScreenSmall ? (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  {logo && (
                    <Avatar
                      alt="Logo de l'entreprise"
                      src={logo.url}
                      sx={{ width: 150, height: 150, mb: 2, mx: "auto" }}
                    />
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Nom: </strong> {name}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Email: </strong> {email}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Téléphone: </strong> {phone}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Adresse: </strong> {address}
                  </Typography>
                </Grid>
              </Grid>
            ) : (
              <FlexBetween>
                <Grid md={6}>
                  {logo && (
                    <Avatar
                      alt="Logo de l'entreprise"
                      src={logo.url}
                      sx={{ width: 150, height: 150, mb: 2, mx: "auto" }}
                    />
                  )}
                </Grid>
                <Grid md={6}>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Nom: </strong> {name}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Email: </strong> {email}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Téléphone: </strong> {phone}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Adresse: </strong> {address}
                  </Typography>
                </Grid>
              </FlexBetween>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              transition: "transform 0.3s",
              "&:hover": { transform: "scale(1.05)" },
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              color={theme.palette.secondary[100]}
            >
              Détails de l'abonnement
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Statut: </strong> {subscriptionStatue}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Date de début: </strong> {subscriptionStartDate}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Date de fin: </strong> {subscriptionEndDate}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Pack: </strong> {pack}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Prix: </strong> {price} €
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              transition: "transform 0.3s",
              "&:hover": { transform: "scale(1.05)" },
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              color={theme.palette.secondary[100]}
            >
              Détails de compte
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Nombre de fournisseur: </strong> {nombreFournisseur}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Nombre de client: </strong> {nombreClient}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Nombre de documents: </strong> {nombreDocument}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EnterpriseDetails;
