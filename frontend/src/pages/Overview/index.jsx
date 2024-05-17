import React from "react";
import { Box } from "@mui/material";
import Header from "componentsAdmin/Header";
import OverviewChart from "componentsAdmin/OverviewChart";
import { useNavigate } from "react-router-dom";

const Overview = () => {
  const navigate = useNavigate()
  if(!localStorage.getItem('userId')) {
    navigate('/');
  }
  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="OVERVIEW"
        subtitle="Progression d'entreprise par mois"
      />
      <Box height="75vh">
        <OverviewChart />
      </Box>
    </Box>
  );
};

export default Overview;