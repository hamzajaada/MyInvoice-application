import React, { useEffect, useState } from "react";
import { useGetBonCommandeDetailsQuery } from "state/api";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Grid, Button, Typography, Paper, useMediaQuery } from "@mui/material";
import styled from "styled-components";
import profileImage from "assets/logo.png";
import FlexBetween from "componementClient/FlexBetween";


const BonCommandeItem = ({ item }) => {
  return (
    <tr>
      <td className="border px-4 py-2">{item.productName}</td>
      <td className="border px-4 py-2">{item.quantity}</td>
      <td className="border px-4 py-2">{item.price.toFixed(2)} DH</td>
    </tr>
  );
};

const BonCommandeTax = ({ tax }) => {
  return (
    <tr>
      <td className="border px-4 py-2">{tax.taxeName}</td>
      <td className="border px-4 py-2">{tax.value.toFixed(2)} DH</td>
    </tr>
  );
};

const BonCommandeDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [bonCommande, setBonCommande] = useState(null);
  const { data } = useGetBonCommandeDetailsQuery(id);
  const isNonMobile = useMediaQuery("(min-width: 900px)");
  const isNoMobile = useMediaQuery("(min-width: 600px)");
  useEffect(() => {
    if (data) {
      setBonCommande(data);
    }
  }, [data]);

  const printBonCommande = () => {
    window.print();
  };

  if (!bonCommande) return <Typography variant="h6">Chargement...</Typography>;

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
            onClick={printBonCommande}
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
        <BonCommandeContainer>
          {isNoMobile ? (
            <Header>
            <Logo src={bonCommande.userLogo.url} alt="Company Logo" />
            <UserInfo>
              <Typography variant="h5" className="font-semibold">
                {bonCommande.userName}
              </Typography>
              <Typography>{bonCommande.userAddress}</Typography>
              <Typography>{bonCommande.userEmail}</Typography>
              <Typography>{bonCommande.userPhone}</Typography>
            </UserInfo>
          </Header>
          ) : (
            <>
              <Logo src={bonCommande.userLogo.url} alt="Company Logo" />
            <UserInfo>
              <Typography variant="h5" className="font-semibold">
                {bonCommande.userName}
              </Typography>
              <Typography>{bonCommande.userAddress}</Typography>
              <Typography>{bonCommande.userEmail}</Typography>
              <Typography>{bonCommande.userPhone}</Typography>
            </UserInfo>
            </>
          )}
          
          {isNonMobile ? (
            <FlexBetween>
              <ClientInfo>
                <Typography variant="h6" className="font-semibold">
                  Bon commande de:
                </Typography>
                <Typography>{bonCommande.fournisseurName}</Typography>
                <Typography>{bonCommande.fournisseurEmail}</Typography>
                <Typography>{bonCommande.fournisseurAddress}</Typography>
                <Typography>{bonCommande.fournisseurPhone}</Typography>
              </ClientInfo>
              <BonCommandeMeta>
                <Typography>
                  <strong>Date de bon de commande:</strong>{" "}
                  {bonCommande.formattedDate}
                </Typography>
                <Typography>
                  <strong>Date d'échéance:</strong>{" "}
                  {bonCommande.formattedDueDate}
                </Typography>
                <Typography>
                  <strong>Statut:</strong> {bonCommande.bonCommandeStatus}
                </Typography>
                <Typography>
                  <strong>Numéro de bon de commande:</strong> {bonCommande._id}
                </Typography>
              </BonCommandeMeta>
            </FlexBetween>
          ) : (
            <>
              <Box sx={{ display: "flex" }}>
                <ClientInfo>
                  <Typography variant="h6" className="font-semibold">
                    Bon commande de:
                  </Typography>
                  <Typography>{bonCommande.fournisseurName}</Typography>
                  <Typography>{bonCommande.fournisseurEmail}</Typography>
                  <Typography>{bonCommande.fournisseurAddress}</Typography>
                  <Typography>{bonCommande.fournisseurPhone}</Typography>
                </ClientInfo>
              </Box>
              <Box sx={{ display: "flex", mt: 2 }}>
                <BonCommandeMeta>
                  <Typography>
                    <strong>Date de bon de commande:</strong>{" "}
                    {bonCommande.formattedDate}
                  </Typography>
                  <Typography>
                    <strong>Date d'échéance:</strong>{" "}
                    {bonCommande.formattedDueDate}
                  </Typography>
                  <Typography>
                    <strong>Statut:</strong> {bonCommande.bonCommandeStatus}
                  </Typography>
                  <Typography>
                    <strong>Numéro de bon de commande:</strong>{" "}
                    {bonCommande._id}
                  </Typography>
                </BonCommandeMeta>
              </Box>
            </>
          )}

          <table className="w-full mb-6 border-collapse" >
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Produit</th>
                <th className="border px-4 py-2">Quantité</th>
                <th className="border px-4 py-2">Prix</th>
              </tr>
            </thead>
            <tbody>
              {bonCommande.itemsTable.map((item, index) => (
                <BonCommandeItem key={index} item={item} />
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
              {bonCommande.taxesTable.map((tax, index) => (
                <BonCommandeTax key={index} tax={tax} />
              ))}
            </tbody>
          </table>
          <TotalAmount>
            <Typography variant="h5" className="text-right font-semibold">
              Montant total: {bonCommande.amount.toFixed(2)} DH
            </Typography>
          </TotalAmount>
          <Signature>
            <Typography>Signature:</Typography>
            <img
              src={bonCommande.userSignature.url}
              alt="Signature"
              className="mt-2"
            />
          </Signature>
        </BonCommandeContainer>
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

export default BonCommandeDetails;

// Styles
const BonCommandeContainer = styled.div`
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
  
`;
const ClientInfo = styled.div`
  margin-bottom: 20px;
`;
const BonCommandeMeta = styled.div`
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
