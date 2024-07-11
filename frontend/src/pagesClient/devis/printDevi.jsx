import React from "react";
import { useGetDeviDetailsQuery } from "state/api";
import { useParams, useNavigate } from "react-router-dom";
import {
  Grid,
  useTheme,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import profileImage from "assets/logo.png";

const PrintInvoice = () => {
  const navigate = useNavigate();
  if (!localStorage.getItem("userId")) {
    navigate("/");
  }
  const { id } = useParams();
  const { data, isLoading } = useGetDeviDetailsQuery(id);
  const theme = useTheme();
  const getStatusColor = (status) => {
    switch (status) {
      case "approuvé":
        return "green";
      case "attente d'approbation":
        return "orange";
      default:
        return "red";
    }
  };

  if (isLoading) return <CircularProgress />;
  if (!data) return <div>No data found</div>;

  const {
    _id,
    deviStatus,
    userName,
    userEmail,
    userPhone,
    userAddress,
    userLogo,
    userSignature,
    clientName,
    clientEmail,
    clientPhone,
    clientAddress,
    formattedDate,
    itemsTable,
    taxesTable,
    amount,
  } = data;

  const printInvoice = () => {
    window.print();
  };

  const sousTotale = itemsTable.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <Box m="1.5rem 2.5rem">
      <Paper
        elevation={3}
        style={{ padding: theme.spacing(3), marginBottom: theme.spacing(3) }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="left">
          <Box
            component="img"
            alt="profile"
            src={profileImage}
            height="110px"
            width="160px"
            sx={{ objectFit: "cover" }}
          />
        </Box>
        <Box m={2} />
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box bgcolor="gray" borderRadius={4} p={2}>
            <Typography
              variant="h6"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              Numéro de Devi : #{_id}
            </Typography>
          </Box>
          <Box bgcolor={getStatusColor(deviStatus)} borderRadius={4} p={2}>
            <Typography
              variant="h6"
              sx={{
                color: "white",
                fontWeight: "bold",
                "@media print": { display: "none" },
              }}
            >
              Status: {deviStatus}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" justifyContent="center" mt={3}>
          <Box
            width="50%"
            borderRadius={4}
            border={`1px solid ${theme.palette.grey[300]}`}
            p={2}
            mr={2}
          >
            {userLogo && (
              <Box
                component="img"
                alt="profile"
                src={`${userLogo.url}`}
                height="50px"
                width="50px"
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
            width="50%"
            borderRadius={4}
            border={`1px solid ${theme.palette.grey[300]}`}
            p={2}
          >
            <Typography
              variant="body1"
              fontWeight="bold"
              color={theme.palette.secondary[300]}
            >
              Devi à : <br />
              <br />
              <br />
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              Nom: {clientName}
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              Email: {clientEmail}
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              Téléphone: {clientPhone}
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              Addresse: {clientAddress}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" justifyContent="center" mt={3}>
          <Box mr={1}>
            <Typography variant="body1" fontWeight="bold">
              Créé le: {formattedDate}
            </Typography>
          </Box>
        </Box>
        <Box m={2} />
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{ marginBottom: theme.spacing(3) }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: "#fd8B36" }}>
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
              <TableRow sx={{ backgroundColor: "#fd8B36" }}>
                <TableCell colSpan={2} align="center">
                  <Typography fontWeight="bold">Taxes </Typography>
                </TableCell>
                <TableCell colSpan={1}>
                  <Typography fontWeight="bold">Taux</Typography>
                </TableCell>
              </TableRow>
              {taxesTable.map((tax, index) => (
                <TableRow key={index} sx={{ backgroundColor: "white" }}>
                  <TableCell colSpan={2} align="center">
                    <Typography>{tax.taxeName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{tax.value}%</Typography>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow sx={{ backgroundColor: "#fd8B36" }}>
                <TableCell colSpan={2} align="right">
                  <Typography fontWeight="bold">Sous - Total :</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">
                    {sousTotale.toFixed(2)} DH
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow sx={{ backgroundColor: "#fd8B36" }}>
                <TableCell colSpan={2} align="right">
                  <Typography fontWeight="bold">Montant Totale:</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">
                    {amount.toFixed(2)} DH
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Box m={7} />
        <Box mt={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Box p={1}>
            <Typography variant="body1" fontWeight="bold">
              Signature:
            </Typography>
            <Box
              component="img"
              src={`${userSignature.url}`}
              alt="Signature"
              sx={{
                width: '170px',
                height: '170px',
                border: '1px solid #000',
                marginLeft: '10px',
                objectFit: 'cover',   
              }}
            />
          </Box>
        </Box>
      </Paper>
      <Grid
        container
        spacing={2}
        justifyContent="center"
        sx={{ "@media print": { display: "none" } }}
      >
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            onClick={printInvoice}
            sx={{
              backgroundColor: "#ff7b00",
              color: "#fff",
              "&:hover": { backgroundColor: "#cc6200" },
            }}
          >
            Imprimer
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate(-1)}
            sx={{
              backgroundColor: "#ff7b00",
              color: "#fff",
              "&:hover": { backgroundColor: "#cc6200" },
            }}
          >
            Annuler
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PrintInvoice;
