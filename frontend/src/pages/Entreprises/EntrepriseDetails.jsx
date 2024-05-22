// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Box, useTheme, Typography } from "@mui/material";
// import { useGetEntrepriseDetailQuery } from "state/api";
// import { DataGrid } from "@mui/x-data-grid";
// import Header from "componentsAdmin/Header";

// const EnterpriseDetails = () => {
//   const navigate = useNavigate();
//   if (!localStorage.getItem("userId")) {
//     navigate("/");
//   }
//   const [enterpriseDetails, setEntreprisesDetails] = useState({
//     _id: "",
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     logo: "",
//     subscriptionStatue: "",
//     subscriptionStartDate: "",
//     subscriptionEndDate: "",
//     pack: "",
//     price: 0,
//   });

//   const theme = useTheme();
//   const { id } = useParams();
//   const { data, isLoading } = useGetEntrepriseDetailQuery(id);
//   useEffect(() => {
//     if (data) {
//       setEntreprisesDetails(data);
//     }
//   }, [data]);

//   if (isLoading) {
//     return <Typography>Loading...</Typography>;
//   }

//   const rows = Object.keys(data).map((key, index) => ({
//     id: index,
//     field: key,
//     value: data[key],
//   }));

//   return (
//     <Box m="1.5rem 2.5rem">
//       <Header
//         title="Entreprise Detail"
//         subtitle="Les détails de l'entreprise"
//       />
//       <Box
//         mt="40px"
//         height="75vh"
//         sx={{
//           "& .MuiDataGrid-root": {
//             border: "none",
//           },
//           "& .MuiDataGrid-cell": {
//             borderBottom: "none",
//           },
//           "& .MuiDataGrid-columnHeaders": {
//             backgroundColor: theme.palette.background.alt,
//             color: theme.palette.secondary[100],
//             borderBottom: "none",
//           },
//           "& .MuiDataGrid-virtualScroller": {
//             backgroundColor: theme.palette.primary.light,
//           },
//           "& .MuiDataGrid-footerContainer": {
//             backgroundColor: theme.palette.background.alt,
//             color: theme.palette.secondary[100],
//             borderTop: "none",
//           },
//           "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
//             color: `${theme.palette.secondary[200]} !important`,
//           },
//         }}
//       >
//         <DataGrid
//           loading={isLoading || !enterpriseDetails}
//           rows={rows}
//           columns={[
//             { field: "field", headerName: "", flex: 1 },
//             { field: "value", headerName: "", flex: 2 },
//           ]}
//           autoHeight
//           disableColumnFilter
//           disableColumnMenu
//           disableColumnSelector
//           disableDensitySelector
//           disableSelectionOnClick
//           density="compact"
//           components={{
//             Toolbar: () => null,
//           }}
//         />
//       </Box>
//     </Box>
//   );
// };

// export default EnterpriseDetails;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  useTheme,
  Typography,
  Grid,
  Paper,
  Avatar,
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
            <Typography variant="h6" 
              color={theme.palette.secondary[100]}
              gutterBottom
            >
              Détails de l'entreprise
            </Typography>
            <Divider sx={{ mb: 2 }} />
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
            <Typography variant="h6" gutterBottom color={theme.palette.secondary[100]}>
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
            <Typography variant="h6" gutterBottom color={theme.palette.secondary[100]}>
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
