import React from "react";
import { useGetBonCommandeDetailsQuery } from "state/api";
import { useParams, useNavigate } from "react-router-dom";
import {
  useMediaQuery,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  Button,
} from "@mui/material";
import Header from "componentsAdmin/Header";

const DetailsBonCommande = () => {
  const navigate = useNavigate();
  if (!localStorage.getItem("userId")) {
    navigate("/");
  }
  const isNonMobile = useMediaQuery("(min-width: 1000px)");
  const { id } = useParams();
  const { data, isLoading } = useGetBonCommandeDetailsQuery(id);
  const theme = useTheme();
  const getStatusColor = (status) => {
    switch (status) {
      case "au cour de traitement":
        return "green";
      case "attent de traitement":
        return "red";
      default:
        return "orange";
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>No data found</div>;

  const {
    _id,
    bonCommandeStatus,
    userName,
    userEmail,
    userPhone,
    userAddress,
    userLogo,
    fournisseurName,
    fournisseurEmail,
    fournisseurPhone,
    fournisseurAddress,
    formattedDate,
    formattedDueDate,
    itemsTable,
    taxesTable,
    amount,
  } = data;

  const sousTotale = itemsTable.reduce((total, item) => total + item.price * item.quantity, 0);
  

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="DETAILS DU BON DE COMMANDE"
        subtitle="Détails de bon de commandes que vous avez sélectionné"
      />
      <Box m={2} />
      <Paper
        elevation={3}
        style={{ padding: theme.spacing(3), marginBottom: theme.spacing(3) }}
      >
        <Box display={isNonMobile ? "flex" : "block"}  justifyContent="space-between" alignItems="center">
          <Box bgcolor="gray" borderRadius={4} p={2}>
            <Typography
              variant="h5"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              Numéro de bon de commande: #{_id}
            </Typography>
          </Box>
          <Box bgcolor={getStatusColor(bonCommandeStatus)} marginTop={isNonMobile ? "0" : "10px"} marginLeft={isNonMobile ? "2px" : "0"} borderRadius={4} p={2}>
            <Typography
              variant="h6"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              Status: {bonCommandeStatus}
            </Typography>
          </Box>
        </Box>
        <Box display={isNonMobile ? "flex" : "block"} justifyContent="center" mt={3}>
          <Box
            width={isNonMobile ? "49%": "100%"}
            borderRadius={4}
            border={`1px solid ${theme.palette.grey[300]}`}
            p={2}
            mr={2}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              color={theme.palette.secondary[300]}
            >
              INFORMATIONS D'ENTREPRISE :<br />
              <br />
            </Typography>
            {userLogo && (
              <Box
                component="img"
                alt="profile"
                src={`${userLogo.url}`}
                height="40px"
                width="40px"
                borderRadius="50%"
                sx={{ objectFit: "cover" }}
              />
            )}
            <Box ml={2}>
              <br />
            </Box>
            <Typography variant="body1" fontWeight="bold">
              Nom: {userName}
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              Email: {userEmail}
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              Téléphone: {userPhone}
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              Addresse: {userAddress}
            </Typography>
          </Box>
          <Box
            width={isNonMobile ? "49%": "100%"}
            marginTop={isNonMobile ? "0" : "10px"}
            borderRadius={4}
            border={`1px solid ${theme.palette.grey[300]}`}
            p={2}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              color={theme.palette.secondary[300]}
            >
              INFORMATIONS DU FOURNISSEUR : <br />
              <br />
              <br />
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              Nom: {fournisseurName}
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              Email: {fournisseurEmail}
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              Téléphone: {fournisseurPhone}
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              Addresse: {fournisseurAddress}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" justifyContent="center" mt={3}>
          <Box mr={15}>
            <Typography variant="body1" fontWeight="bold">
              Créé le: {formattedDate}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body1" fontWeight="bold">
              Date d'échéance: {formattedDueDate}
            </Typography>
          </Box>
        </Box>
      </Paper>
      <TableContainer
        component={Paper}
        elevation={3}
        sx={{ marginBottom: theme.spacing(3) }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: theme.palette.primary.main }}>
            <TableRow>
              <TableCell>
                <Typography fontWeight="bold">Nom Du Produit</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">Quantité</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">Prix</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {itemsTable.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.productName}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.price.toFixed(2)} DH</TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
              <TableCell colSpan={2} align="right"><Typography fontWeight="bold">Sous - Totale:</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">{sousTotale.toFixed(2)} DH</Typography></TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
              <TableCell colSpan={2} ><Typography fontWeight="bold" >Taxes </Typography></TableCell>
              <TableCell colSpan={1} ><Typography fontWeight="bold" >Taux</Typography></TableCell>
            </TableRow>
            {taxesTable.map((tax, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={2} >{tax.taxeName}</TableCell>
                    <TableCell>{tax.value}%</TableCell>
                  </TableRow>
                ))}
            
            <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
              <TableCell colSpan={2} align="right"><Typography fontWeight="bold">Montant Totale:</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">{amount.toFixed(2)} DH</Typography></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate(-1)}
      >
        RETOUR
      </Button>
    </Box>
  );
};

export default DetailsBonCommande;