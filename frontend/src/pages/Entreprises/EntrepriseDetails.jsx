import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, useTheme, Typography } from "@mui/material";
import { useGetEntrepriseDetailQuery } from "state/api";
import { DataGrid } from "@mui/x-data-grid";
import Header from "componentsAdmin/Header";

const EnterpriseDetails = () => {
  const navigate = useNavigate();
  if (!localStorage.getItem("userId")) {
    navigate("/");
  }
  const [enterpriseDetails, setEntreprisesDetails] = useState({
    _id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    logo: "",
    subscriptionStatue: "",
    subscriptionStartDate: "",
    subscriptionEndDate: "",
    pack: "",
    price: 0,
  });

  const theme = useTheme();
  const { id } = useParams();
  const { data, isLoading } = useGetEntrepriseDetailQuery(id);
  useEffect(() => {
    if (data) {
      setEntreprisesDetails(data);
    }
  }, [data]);

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  const rows = Object.keys(data).map((key, index) => ({
    id: index,
    field: key,
    value: data[key],
  }));

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="Entreprise Detail"
        subtitle="Les détails de l'entreprise"
      />
      <Box
        mt="40px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <DataGrid
          loading={isLoading || !enterpriseDetails}
          rows={rows}
          columns={[
            { field: "field", headerName: "", flex: 1 },
            { field: "value", headerName: "", flex: 2 },
          ]}
          autoHeight
          disableColumnFilter
          disableColumnMenu
          disableColumnSelector
          disableDensitySelector
          disableSelectionOnClick
          density="compact"
          components={{
            Toolbar: () => null,
          }}
        />
      </Box>
    </Box>
  );
};

export default EnterpriseDetails;
