import React, { useState } from "react";
import { FormControl, MenuItem, InputLabel, Box, Select, Typography,  useTheme } from "@mui/material";
import OverviewChart from "componementClient/OverviewChart";

const Overview = () => {
  const [view, setView] = useState("units");
  const theme = useTheme();

  return (
    <Box m="1.5rem 2.5rem">
     <Box>
      <Typography
        variant="h2"
        color={theme.palette.secondary[100]}
        fontWeight="bold"
        sx={{ mb: "5px" }}
      >
          APERÇU
      </Typography>
      <Typography variant="h5" color={theme.palette.secondary[300]}>
          Vue d'ensemble des revenus et des bénéfices généraux
      </Typography>
    </Box>
      <Box height="75vh">
        <FormControl sx={{ mt: "1rem" }}>
          <InputLabel>Vue</InputLabel>
          <Select
            value={view}
            label="Vue"
            onChange={(e) => setView(e.target.value)}
          >
            <MenuItem value="sales">Ventes</MenuItem>
            <MenuItem value="units">Unités</MenuItem>
          </Select>
        </FormControl>
        <OverviewChart view={view} />
      </Box>
    </Box>
  );
};

export default Overview;