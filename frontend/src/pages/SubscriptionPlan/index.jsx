import React, { useState, useEffect } from "react";
import { Box, useTheme, IconButton } from "@mui/material";
import Header from "componentsAdmin/Header";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
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
  // const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
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
  // const [removeSubscription] = useRemoveSubscriptionMutation();
 
  
  const columns = [
    {
      field: "enterpriseName",
      headerName: "Entreprise",
      flex: 0.5,
    },
    {
      field: "packName",
      headerName: "Pack",
      flex: 0.5,
    },
    {
      field: "packPrice",
      headerName: "Prix",
      flex: 0.5,
    },
    {
      field: "startDate",
      headerName: "Date de début",
      flex: 0.5,
    },
    {
      field: "endDate",
      headerName: "Date de fin",
      flex: 0.5,
    },
    {
      field: "status",
      headerName: "Statue d'abonnement",
      flex: 0.5,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.4,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            onClick={() => handleEdit(params.row._id)}
            aria-label="edit"
          >
            <EditIcon />
          </IconButton>
          {/* <IconButton
            onClick={() => handleDelete(params.row._id)}
            aria-label="delete"
          >
            <DeleteIcon />
          </IconButton> */}
        </Box>
      ),
    },
  ];

  const handleEdit = (id) => {
    window.location.href = `/SubscriptionsPlans/edit/${id}`;
  };

  // const handleDelete = async (id) => {
  //   try {
  //     await removeSubscription(id);
  //     window.location.reload();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="PLANS D'ABONNEMENT" subtitle="La liste des plans d'abonnement" />
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
          loading={!subscriptionPlan.length}
          getRowId={(row) => row._id}
          rows={subscriptionPlan || []}
          columns={columns}
        />
      </Box>
    </Box>
  );
};

export default SubscriptionPalns;
