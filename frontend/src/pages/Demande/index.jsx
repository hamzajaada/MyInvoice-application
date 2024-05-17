import React, { useState, useEffect } from "react";
import { Box, useTheme, IconButton, Avatar } from "@mui/material";
import { useGetSubscriptionEntQuery, useUpdateSubscriptionMutation, useGetDemandesQuery, useUpdateDemandeMutation, useRemoveDemandeMutation } from "state/api";
import Header from "componentsAdmin/Header";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import AddTaskOutlinedIcon from '@mui/icons-material/AddTaskOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
const SubscriptionPalns = () => {
  const navigate = useNavigate();
  if (!localStorage.getItem("userId")) {
    navigate("/");
  }

  const [demande, setDemande] = useState([]);
  const theme = useTheme();
  // hadi
  const { data, isLoading } = useGetDemandesQuery();
  const [idEntreprise, setIdEntreprise] = useState("");
  const { data: subscriptionData } = useGetSubscriptionEntQuery(idEntreprise, { skip: !idEntreprise });
  const [removeDemande] = useRemoveDemandeMutation();
  const [updateDemande] = useUpdateDemandeMutation();
  const [updateSubscription] = useUpdateSubscriptionMutation();
  useEffect(() => {
    if (data) {
      setDemande(data);
      
    }
  }, [data]);

  const renderAvatarCell = (params) => {
    const { logo, enterpriseName } = params.row;
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Avatar
          src={`http://localhost:3001/Images/${logo}`}
          alt={enterpriseName}
          sx={{ width: 35, height: 35 }} 
        />
        <Box ml={1}>
          <div>{enterpriseName}</div>
        </Box>
      </Box>
    );
  };

  const columns = [
    {
      field: "enterpriseName",
      headerName: "Entreprise",
      flex: 0.5,
      renderCell: renderAvatarCell,
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
      field: "nombreAnnee",
      headerName: "Nombre d'année",
      flex: 0.5,
    },
    {
      field: "amount",
      headerName: "Prix total",
      flex: 0.5,
    },
    {
      field: "status",
      headerName: "Statue",
      flex: 0.5,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.6,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            onClick={() => handleEditYes(params.row)}
            aria-label="edit"
          >
            <AddTaskOutlinedIcon />
          </IconButton>
          <IconButton
            onClick={() => handleEditNo(params.row._id)}
            aria-label="edit"
          >
            <CloseOutlinedIcon />
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

  const handleEditYes = async (demande) => {
    if (!demande) {
      console.error("Demande non trouvée");
      return;
    }
    setIdEntreprise(demande.enterpriseId);
  };

  useEffect(() => {
    if (subscriptionData && idEntreprise) {
      const thisDemande = data.find((d) => d.enterpriseId === idEntreprise);
      // console.log(subscriptionData)
      if (!thisDemande) return;

      const startDate = new Date();
      const endDate = new Date(startDate.setFullYear(startDate.getFullYear() + Number(thisDemande.nombreAnnee)));

      const subscription = {
        packId: thisDemande.packId,
        startDate: new Date(),
        endDate: endDate,
        status: "active",
      };
      const id = subscriptionData[0]._id;

      (async () => {
        try {
          
          await updateSubscription({ id, subscription });
          const updatedDemande = { ...thisDemande, status: "accepter" };
          
          await updateDemande({ id: thisDemande._id, updatedDemande });
          
          // setDemande((prev) => prev.map(d => d._id === thisDemande._id ? updatedDemande : d));
          alert('Changement avec succès');
        } catch (error) {
          console.error("Erreur lors de la mise à jour de la souscription", error);
        }
      })();
    }
  }, [subscriptionData, idEntreprise, data, updateDemande, updateSubscription]);

  const handleEditNo = async (id) => {
    const thisDemande = data.find((demande) => demande._id === id);
    thisDemande.status = "rejeter";
    await updateDemande({ id, ...thisDemande });
  };

  const handleDelete = async (id) => {
    try {
      await removeDemande(id);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="DEMANDES" subtitle="Les plans de demandes de changement de pack" />
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
          loading={isLoading || !demande}
          getRowId={(row) => row._id}
          rows={demande || []}
          columns={columns}
        />
      </Box>
    </Box>
  );
};

export default SubscriptionPalns;
