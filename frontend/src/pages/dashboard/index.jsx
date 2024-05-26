import React, { useEffect, useState } from "react";
import FlexBetween from "componentsAdmin/FlexBetween";
import Header from "componentsAdmin/Header";
import {
  DownloadOutlined,
  PersonAdd,
} from "@mui/icons-material";
import RemoveIcon from '@mui/icons-material/Remove';
import PaidIcon from '@mui/icons-material/Paid';
import DescriptionIcon from '@mui/icons-material/Description';

import {
  Box,
  Button,
  useTheme,
  useMediaQuery,
  Typography
} from "@mui/material";

import OverviewChart from "componentsAdmin/OverviewChart";
import axios from 'axios'; // Importez axios
import StatBox from "componentsAdmin/StatBox";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate()
  if(!localStorage.getItem('userId')) {
    navigate('/');
  }
  const [dashboard, setDashboard] = useState({
    totalEntreprises: "",
    totalDocuments: 0,
    paidInvoices: "",
    unpaidInvoices: "",
  })
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const isSmallScreen = useMediaQuery("(max-width: 500px)");
  
  useEffect(()=>{
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/Api/Entreprise/dashboard");
        setDashboard(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDashboardData();
  },[]) // Utilisez une dépendance vide pour exécuter cet effet une seule fois

  return (
    <Box m={isSmallScreen ? "1rem" : "1.5rem 2.5rem"} overflow="hidden">
      <FlexBetween>
        <Header title="TABLEAU DE BORD" subtitle="Bienvenue sur votre tableau de bord." />

        {/* <Box>
          <Button
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.background.alt,
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlined sx={{ mr: "10px" }} />
            Télécharger le rapport
          </Button>
        </Box> */}
      </FlexBetween>

      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns={isSmallScreen ? "1fr" : "repeat(8, 1fr)"}
        gridAutoRows="160px"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        {/* ROW 1 */}
        <StatBox
          title="Total Entreprises"
          value={dashboard && dashboard.totalEntreprises}
          description="Le nombre total d'entreprise dans le système"
          icon={
            <PersonAdd
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="Total des documents"
          value={dashboard && dashboard.totalDocuments}
          description="Le nombre total de documents dans le système"
          icon={
            <DescriptionIcon
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="Documents payé"
          value={dashboard && dashboard.paidInvoices}
          description="Le nombre total de documents payée dans le système"
          icon={
            <PaidIcon
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="Documents impayée"
          value={dashboard && dashboard.unpaidInvoices}
          description="Le nombre total de documents impayée dans le système"
          icon={
            <RemoveIcon
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />

        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
          sx={{ maxWidth: isSmallScreen ? '100%' : 'auto' }}
        >
          <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
            Entreprises par mois
          </Typography>
          <OverviewChart isDashboard={true} />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;

