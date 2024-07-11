import React from 'react';
import { useGetInvoiceDetailsQuery } from "state/api";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, useTheme, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress } from '@mui/material';
import profileImage from "assets/logo.png";

const PrintClassicInvoice = () => {
  const navigate = useNavigate();
  if (!localStorage.getItem('userId')) {
    navigate('/');
  }
  const { id } = useParams();
  const { data, isLoading } = useGetInvoiceDetailsQuery(id);
  const theme = useTheme();
  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return "green";
      case 'late':
        return "red";
      default:
        return "orange";
    }
  };

  if (isLoading) return <CircularProgress />;
  if (!data) return <div>No data found</div>;

  const {
    _id,
    invoiceStatus,
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
    formattedDueDate,
    itemsTable,
    taxesTable, 
    amount,
  } = data;

  const printInvoice = () => {
    window.print();
  };

  const sousTotale = itemsTable.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <Box m="1.5rem 2.5rem">
      <Paper elevation={3} style={{ padding: theme.spacing(3), marginBottom: theme.spacing(3), border: `1px solid ${theme.palette.grey[300]}` }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box component="img" alt="profile" src={profileImage} height="110px" width="160px" sx={{ objectFit: "cover" }} />
          <Box textAlign="right">
            <Typography variant="h4" fontWeight="bold" sx={{ color: theme.palette.primary.main }}>FACTURE</Typography>
            <Typography variant="h6">Facture N°: #{_id}</Typography>
            <Typography variant="h6" sx={{ color: getStatusColor(invoiceStatus), '@media print': { display: 'none' } }}>Status: {invoiceStatus}</Typography>
          </Box>
        </Box>

        <Box display="flex" justifyContent="space-between" mb={3}>
          <Box>
            <Typography variant="h6" fontWeight="bold" mb={1}>Émetteur:</Typography>
            {userLogo && <Box component="img" alt="user-logo" src={`${userLogo.url}`} height="50px" width="50px" borderRadius="50%" sx={{ objectFit: "cover" }} />}
            <Typography variant="body1" fontWeight="bold">Nom: {userName}</Typography>
            <Typography variant="body1" fontWeight="bold">Email: {userEmail}</Typography>
            <Typography variant="body1" fontWeight="bold">Téléphone: {userPhone}</Typography>
            <Typography variant="body1" fontWeight="bold">Adresse: {userAddress}</Typography>
          </Box>

          <Box textAlign="right">
            <Typography variant="h6" fontWeight="bold" mb={1}>Facturé à:</Typography>
            <Typography variant="body1" fontWeight="bold">Nom: {clientName}</Typography>
            <Typography variant="body1" fontWeight="bold">Email: {clientEmail}</Typography>
            <Typography variant="body1" fontWeight="bold">Téléphone: {clientPhone}</Typography>
            <Typography variant="body1" fontWeight="bold">Adresse: {clientAddress}</Typography>
          </Box>
        </Box>

        <Box display="flex" justifyContent="space-between" mb={3}>
          <Box>
            <Typography variant="body1" fontWeight="bold">Créé le: {formattedDate}</Typography>
          </Box>
          <Box>
            <Typography variant="body1" fontWeight="bold">Date d'échéance: {formattedDueDate}</Typography>
          </Box>
        </Box>

        <TableContainer component={Paper} elevation={3} sx={{ marginBottom: theme.spacing(3), border: `1px solid ${theme.palette.grey[300]}` }}>
          <Table>
            <TableHead sx={{ backgroundColor: theme.palette.primary.main }}>
              <TableRow>
                <TableCell><Typography fontWeight="bold" color="white">Nom Du Produit</Typography></TableCell>
                <TableCell><Typography fontWeight="bold" color="white">Quantité</Typography></TableCell>
                <TableCell><Typography fontWeight="bold" color="white">Prix</Typography></TableCell>
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
                <TableCell colSpan={2} align="center"><Typography fontWeight="bold" color="white">Taxes</Typography></TableCell>
                <TableCell colSpan={1}><Typography fontWeight="bold" color="white">Taux</Typography></TableCell>
              </TableRow>
              {taxesTable.map((tax, index) => (
                <TableRow key={index} sx={{ backgroundColor: "white" }}>
                  <TableCell colSpan={2} align="center"><Typography>{tax.taxeName}</Typography></TableCell>
                  <TableCell><Typography>{tax.value}%</Typography></TableCell>
                </TableRow>
              ))}
              <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                <TableCell colSpan={2} align="right"><Typography fontWeight="bold" color="white">Sous - Total :</Typography></TableCell>
                <TableCell><Typography fontWeight="bold" color="white">{sousTotale.toFixed(2)} DH</Typography></TableCell>
              </TableRow>
              <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                <TableCell colSpan={2} align="right"><Typography fontWeight="bold" color="white">Montant Total :</Typography></TableCell>
                <TableCell><Typography fontWeight="bold" color="white">{amount.toFixed(2)} DH</Typography></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Box display="flex" justifyContent="flex-end" mt={3}>
          <Box textAlign="right">
            <Typography variant="body1" fontWeight="bold">Signature:</Typography>
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

      <Grid container spacing={2} justifyContent="center" sx={{ '@media print': { display: 'none' } }}>
        <Grid item>
          <Button variant="contained" color="secondary" onClick={printInvoice} sx={{ backgroundColor: theme.palette.primary.main, color: '#fff', '&:hover': { backgroundColor: theme.palette.primary.dark } }}>
            Imprimer
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="secondary" onClick={() => navigate(-1)} sx={{ backgroundColor: theme.palette.primary.main, color: '#fff', '&:hover': { backgroundColor: theme.palette.primary.dark } }}>
            Annuler
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PrintClassicInvoice;