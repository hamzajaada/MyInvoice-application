import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useTheme } from "@mui/system";

const AddButton = ({ onClick , label }) => {
  const theme = useTheme();

  return (
    <Box display="flex" justifyContent="flex-end" marginBottom={2}>
      <IconButton
      sx={{
        backgroundColor: theme.palette.secondary[400],
        color : theme.palette.secondary[100],
        borderRadius: "16px",
      }}
        onClick={onClick}
      >
        <AddIcon />
        <Typography
        variant="body1"
        style={{
          color: theme.palette.primary.contrastText,
          marginLeft: theme.spacing(1),
          fontWeight: 'bold'
        }}
      >
        {`${label}`}
      </Typography>
      </IconButton>
      
      
    </Box>
  );
};

export default AddButton;