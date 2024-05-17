import { Typography, Box, useTheme } from "@mui/material";
import React from "react";

const Header = ({ title, subtitle, total }) => {
  const theme = useTheme();
  return (
    <Box>
      <Typography
        variant="h2"
        color={theme.palette.secondary[100]}
        fontWeight="bold"
        sx={{ mb: "5px" }}
      >
        {title}
      </Typography>
      <Typography variant="h5" color={theme.palette.secondary[300]}>
        {`${subtitle}`+`${title.toLowerCase()}`+` (${total}`+` ${title.toLowerCase()})`}
      </Typography>
    </Box>
  );
};

export default Header;