import React, { useEffect, useState } from "react";
import { useGetBonLivraisonDetailsQuery } from "state/api";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Grid, Button, Typography, Paper } from "@mui/material";
import styled from "styled-components";
import profileImage from "assets/logo.png";
import FlexBetween from "componementClient/FlexBetween";

const BonLivraisonItem = ({ item }) => {
  return (
    <tr>
      <td className="border px-4 py-2">{item.productName}</td>
      <td className="border px-4 py-2">{item.quantity}</td>
      <td className="border px-4 py-2">{item.price.toFixed(2)} DH</td>
    </tr>
  );
};

const BonLivraisonTax = ({ tax }) => {
  return (
    <tr>
      <td className="border px-4 py-2">{tax.taxeName}</td>
      <td className="border px-4 py-2">{tax.value.toFixed(2)} DH</td>
    </tr>
  );
};

const BonLivraisonDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [bonLivraison, setBonLivraison] = useState(null);
  const { data } = useGetBonLivraisonDetailsQuery(id);

  useEffect(() => {
    if (data) {
      setBonLivraison(data);
    }
  }, [data]);

  const printBonLivraison = () => {
    window.print();
  };

  if (!bonLivraison) return <Typography variant="h6">Chargement...</Typography>;

  return (
    <Box m="1.5rem 2.5rem">
      <Paper className="p-6">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          className="mb-6"
        >
          <Box
            component="img"
            alt="profile"
            src={profileImage}
            height="100px"
            width="150px"
            sx={{ objectFit: "cover" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={printBonLivraison}
            sx={{
              backgroundColor: "#ff7b00",
              color: "#fff",
              "&:hover": { backgroundColor: "#cc6200" },
              "@media print": { display: "none" },
            }}
          >
            Imprimer
          </Button>
        </Box>
        <BonLivraisonContainer>
          <Header>
            <Logo src={bonLivraison.userLogo.url} alt="Company Logo" />
            <UserInfo>
              <Typography variant="h5" className="font-semibold">
                {bonLivraison.userName}
              </Typography>
              <Typography>{bonLivraison.userAddress}</Typography>
              <Typography>{bonLivraison.userEmail}</Typography>
              <Typography>{bonLivraison.userPhone}</Typography>
            </UserInfo>
          </Header>
          <FlexBetween>
            <ClientInfo>
              <Typography variant="h6" className="font-semibold">
                Bon livraison de:
              </Typography>
              <Typography>{bonLivraison.fournisseurName}</Typography>
              <Typography>{bonLivraison.fournisseurEmail}</Typography>
              <Typography>{bonLivraison.fournisseurAddress}</Typography>
              <Typography>{bonLivraison.fournisseurPhone}</Typography>
            </ClientInfo>
            <BonLivraisonMeta>
              <Typography>
                <strong>Date de bon de livraison:</strong> {bonLivraison.formattedDate}
              </Typography>
              <Typography>
                <strong>Date d'échéance:</strong> {bonLivraison.formattedDueDate}
              </Typography>
              <Typography>
                <strong>Statut:</strong> {bonLivraison.bonLivraisonStatus}
              </Typography>
              <Typography>
                <strong>Numéro de bon de livraison:</strong> {bonLivraison._id}
              </Typography>
            </BonLivraisonMeta>
          </FlexBetween>

          <table className="w-full mb-6 border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Produit</th>
                <th className="border px-4 py-2">Quantité</th>
                <th className="border px-4 py-2">Prix</th>
              </tr>
            </thead>
            <tbody>
              {bonLivraison.itemsTable.map((item, index) => (
                <BonLivraisonItem key={index} item={item} />
              ))}
            </tbody>
          </table>
          <table className="w-full mb-6 border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Nom de la taxe</th>
                <th className="border px-4 py-2">Valeur</th>
              </tr>
            </thead>
            <tbody>
              {bonLivraison.taxesTable.map((tax, index) => (
                <BonLivraisonTax key={index} tax={tax} />
              ))}
            </tbody>
          </table>
          <TotalAmount>
            <Typography variant="h5" className="text-right font-semibold">
              Montant total: {bonLivraison.amount.toFixed(2)} DH
            </Typography>
          </TotalAmount>
          <Signature>
            <Typography>Signature:</Typography>
            <img
              src={bonLivraison.userSignature.url}
              alt="Signature"
              className="mt-2"
            />
          </Signature>
        </BonLivraisonContainer>
        <Grid
          container
          spacing={2}
          justifyContent="center"
          sx={{ "@media print": { display: "none" } }}
        >
          <Grid item>
            <Button
              variant="contained"
              color="primary"
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
      </Paper>
    </Box>
  );
};

export default BonLivraisonDetails;

// Styles
const BonLivraisonContainer = styled.div`
  font-family: Arial, sans-serif;
  padding: 20px;
`;
const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;
const Logo = styled.img`
  max-width: 150px;
`;
const UserInfo = styled.div`
  text-align: right;
`;
const ClientInfo = styled.div`
  margin-bottom: 20px;
`;
const BonLivraisonMeta = styled.div`
  margin-bottom: 20px;
`;
const TotalAmount = styled.div`
  text-align: right;
  margin-bottom: 20px;
`;
const Signature = styled.div`
  text-align: left;
  margin-top: 40px;

  img {
    max-width: 200px;
  }
`;
