import React, { useEffect, useState } from 'react';
import { useGetBonLivraisonDetailsQuery } from "state/api";
import { useParams, useNavigate } from "react-router-dom";
import { CircularProgress, Typography, Button, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import axios from 'axios';

const SendEmailBonLivraison = () => {
  const navigate = useNavigate();
  if (!localStorage.getItem('userId')) {
    navigate('/');
  }
  const { id } = useParams();
  const { data, isLoading } = useGetBonLivraisonDetailsQuery(id);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    if (data) {
      const sendEmail = async () => {
        setIsSendingEmail(true);
        const sousTotale = data.itemsTable.reduce((total, item) => total + item.price * item.quantity, 0);
        try {
          await axios.post('http://localhost:3001/Api/BonLivraison/email', {
            _id: data._id,
            userName: data.userName,
            userEmail: data.userEmail,
            userPhone: data.userPhone,
            userAddress: data.userAddress,
            fournisseurName: data.fournisseurName,
            fournisseurEmail: data.fournisseurEmail,
            formattedDateLivraison: data.formattedDateLivraison,
            itemsTable: data.itemsTable,
            taxesTable: data.taxesTable,
            sousTotale: sousTotale,
            amount: data.amount,
          });
          setEmailSent(true);
        } catch (error) {
          setError(error.message);
          console.error('Error sending email:', error.message);
        }
        setIsSendingEmail(false);
      };

      sendEmail();
    }
  }, [data]);

  const handleReturn = () => {
    navigate(-1); 
  };

  if (isLoading) return <CircularProgress />;
  if (!data) return <div>No data found</div>;

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="75vh">
      {isSendingEmail && <CircularProgress />}
      {!isSendingEmail && emailSent && (
        <>
          <Typography variant="body1" fontWeight="bold" fontSize="30px">L'email a été envoyé avec succès</Typography>
          <Box m={1}/>
          <CheckCircleIcon sx={{ fontSize: 100, color: 'green' }} />
          <Box m={2}/>
          <Button variant="contained" onClick={handleReturn} sx={{ backgroundColor: '#ff7b00', color: '#fff', '&:hover': { backgroundColor: '#cc6200' } }}>Retour</Button>
        </>
      )}
      {!isSendingEmail && !emailSent && (
        <>
          <Typography variant="body1" fontWeight="bold" fontSize="30px">L'envoi de l'email a échoué</Typography>
          <ErrorIcon sx={{ fontSize: 100, color: 'red' }} />
          <Box m={1}/>
          <Typography variant="body2" fontSize="15px">Vérifiez votre adresse email ou l'adresse de votre client</Typography>
          <Box m={2}/>
          <Button variant="contained" onClick={handleReturn} sx={{ backgroundColor: '#ff7b00', color: '#fff', '&:hover': { backgroundColor: '#cc6200' } }} >Retour</Button>
        </>
      )}
    </Box>
  );
};

export default SendEmailBonLivraison;