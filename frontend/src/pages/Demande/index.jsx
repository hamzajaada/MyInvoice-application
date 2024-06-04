import React, { useState, useEffect } from "react";
import { Box, useTheme, IconButton } from "@mui/material";
import {
  useGetSubscriptionEntQuery,
  useUpdateSubscriptionMutation,
  useUpdateDemandeMutation,
  useRemoveDemandeMutation,
} from "state/api";
import Header from "componentsAdmin/Header";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { toast } from "react-toastify";
import axios from "axios";

const SubscriptionPalns = () => {
  const navigate = useNavigate();
  if (!localStorage.getItem("userId")) {
    navigate("/");
  }

  const [demande, setDemande] = useState([]);
  const theme = useTheme();
  // hadi
  const [isLoading, setIsLoading] = useState(true);
  const [idEntreprise, setIdEntreprise] = useState("");
  const { data: subscriptionData } = useGetSubscriptionEntQuery(idEntreprise, {
    skip: !idEntreprise,
  });
  const [removeDemande] = useRemoveDemandeMutation();
  const [updateDemande] = useUpdateDemandeMutation();
  const [updateSubscription] = useUpdateSubscriptionMutation();
  useEffect(() => {
    const fetchEntreprises = async () => {
      try {
        const response = await axios.get("http://localhost:3001/Api/Demande");
        setDemande(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    fetchEntreprises();
  }, []);

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
      toast.error("Demande non trouvée");
      return;
    }
    setIdEntreprise(demande.enterpriseId);
  };

  useEffect(() => {
    if (subscriptionData && idEntreprise) {
      const thisDemande = demande.find((d) => d.enterpriseId === idEntreprise);
      if (!thisDemande) return;

      const startDate = new Date();
      const endDate = new Date(
        startDate.setFullYear(
          startDate.getFullYear() + Number(thisDemande.nombreAnnee)
        )
      );

      const subscription = {
        packId: thisDemande.packId,
        startDate: new Date(),
        endDate: endDate,
        status: "active",
      };
      const id = subscriptionData[0]._id;

      (async () => {
        try {
          const { data } = await updateSubscription({
            id,
            subscriptionData: subscription,
          });
          console.log(data)
          if (data.success) {
            
            const updatedDemande = { ...thisDemande, status: "accepter" };
            const { data } = await updateDemande({
              id: thisDemande._id,
              DemandeData: updatedDemande,
            });
            if (data.success) {
              toast.success("Demande accepter avec succès");
            } else {
              toast.error("la demande n'accepte pas avec succès");
            }
          }
        } catch (error) {
          toast.error("Erreur lors de la mise à jour de l'abonnement");
        }
      })();
    }
  }, [
    subscriptionData,
    idEntreprise,
    demande,
    updateDemande,
    updateSubscription,
  ]);

  const handleEditNo = async (id) => {
    const thisDemande = demande.find((dem) => dem._id === id);
    thisDemande.status = "rejeter";
    const {data} = await updateDemande({ id, ...thisDemande });
    if (data.success) {
      toast.success("Demande rejeter avec success");
    } else {
      toast.error("la demande ne rejéte pas avec success");
    }
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
      <Header
        title="DEMANDES"
        subtitle="Les plans de demandes de changement de pack"
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
          loading={isLoading || demande.length === 0}
          getRowId={(row) => row._id}
          rows={demande || []}
          columns={columns}
        />
      </Box>
    </Box>
  );
};

export default SubscriptionPalns;
