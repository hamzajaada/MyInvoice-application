import React, { useState, useEffect } from "react";
import { Box, useTheme, IconButton, useMediaQuery } from "@mui/material";
import {  useRemoveSubscriptionMutation } from "state/api";
import Header from "componentsAdmin/Header";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const SubscriptionPalns = () => {
  const navigate = useNavigate()
  if(!localStorage.getItem('userId')) {
    navigate('/');
  }
  const [subscriptionPlan, setSubscriptionPlan] = useState({
    _id: "",
    enterpriseName: "",
    packName: "",
    packPrice: "",
    startDate: "",
    endDate: "",
    status: "",
  })
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await axios.get("http://localhost:3001/Api/Subscription/");
        setSubscriptionPlan(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSubscription();
  }, []);
  const [removeSubscription] = useRemoveSubscriptionMutation();
 
  
  const columns = [
    {
      field: "enterpriseName",
      headerName: "Entreprise",
      width: isSmallScreen ? 150 : 200,
    },
    {
      field: "packName",
      headerName: "Pack",
      width: isSmallScreen ? 150 : 200,
    },
    {
      field: "packPrice",
      headerName: "Prix",
      width: isSmallScreen ? 100 : 150,
    },
    {
      field: "startDate",
      headerName: "Date de début",
      width: isSmallScreen ? 100 : 150,
    },
    {
      field: "endDate",
      headerName: "Date de fin",
      width: isSmallScreen ? 100 : 150,
    },
    {
      field: "status",
      headerName: "Statue",
      width: isSmallScreen ? 100 : 150,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: isSmallScreen ? 100 : 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            onClick={() => handleEdit(params.row._id)}
            aria-label="edit"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(params.row._id)}
            aria-label="delete"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleEdit = (id) => {
    window.location.href = `/SubscriptionsPlans/edit/${id}`;
  };

  const handleDelete = async (id) => {
    try {
      await removeSubscription(id);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="SUBSCRIPTION PLANS" subtitle="Les plans d'abonnement" />
      <Box
        mt="40px"
        // height="75vh"
        sx={{
          overflowX: isSmallScreen ? "auto" : "hidden",
          width: "100%",
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
          loading={!subscriptionPlan.length}
          getRowId={(row) => row._id}
          rows={subscriptionPlan || []}
          columns={columns}
          sx={{
            overflowX: isSmallScreen ? "auto" : "hidden",
            width: "100%",
          }}
        />
      </Box>
    </Box>
  );
};

export default SubscriptionPalns;
