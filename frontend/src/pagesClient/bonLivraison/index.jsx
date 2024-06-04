import React, { useEffect, useState } from "react";
import {
  Box,
  useTheme,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useGetOnePackQuery, useUpdateBonLivraisonMutation } from "state/api";
import Header from "componementClient/Header";
import DataGridCustomToolbar from "componementClient/DataGridCustomToolbar";
import FlexBetween from "componentsAdmin/FlexBetween";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  CheckCircleOutline,
  HourglassEmpty,
  ErrorOutline,
} from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import EmailIcon from "@mui/icons-material/Email";
import PrintIcon from "@mui/icons-material/Print";
import axios from "axios";
import { toast } from "react-toastify";

const BonLivraison = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const packId = localStorage.getItem("packId");
  const id = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const formPdf = "6630fdb21c1fec2176ead2c1";
  const { data: packData } = useGetOnePackQuery(packId);
  const [bonLivraison, setbonLivraison] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [generatePdf, setGeneratePdf] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  useEffect(() => {
    if (packData) {
      setGeneratePdf(
        packData.services.some((service) => service.serviceId._id === formPdf)
      );
    }
  }, [packData]);

  // hadi
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/Api/BonLivraison/List/${id}`
        );
        setbonLivraison(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    } else {
      navigate("/");
    }
  }, [id, navigate]);
  const [updateBonLivraison] = useUpdateBonLivraisonMutation();

  if (!localStorage.getItem("userId")) {
    navigate("/");
  }

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error("Invalid date string:", dateString);
      return "";
    }
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return date.toLocaleDateString("fr-FR", options);
  };

  const columns = [
    {
      field: "_id",
      headerName: "Numéro de bon de livraison",
      flex: 1,

      renderCell: (params) => (
        <span
          style={{
            display: "inline-block",
            fontWeight: "bold",
            color: "white",
            backgroundColor: "gray",
            borderRadius: "4px",
            padding: "5px 10px",
            lineHeight: "1",
          }}
        >
          #{params.value}
        </span>
      ),
    },
    {
      field: "bonCommandeId",
      headerName: "Numéro de commande",
      flex: 1,
      renderCell: (params) => (
        <span
          style={{
            display: "inline-block",
            fontWeight: "bold",
            color: "white",
            backgroundColor: "gray",
            borderRadius: "4px",
            padding: "5px 10px",
            lineHeight: "1",
          }}
        >
          #{params.row.bonCommandeId._id}
        </span>
      ),
    },
    {
      field: "dateLivraison",
      headerName: "Date de livraison",
      flex: 0.7,
      renderCell: (params) => formatDate(params.value),
    },
    {
      field: "amount",
      headerName: "Montant",
      flex: 0.5,
      renderCell: (params) => {
        // Extract the amount from the payments array
        const paymentAmounts = params.value;
        const textColor = theme.palette.mode === "dark" ? "cyan" : "green";
        // Display the total amount
        return (
          <span style={{ color: textColor }}>
            {paymentAmounts.toFixed(2)} DH
          </span>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      renderCell: (params) => {
        const status = params.value;
        let icon, backgroundColor;

        switch (status) {
          case "attent de confirmation":
            icon = (
              <HourglassEmpty style={{ color: "white", fontSize: "1rem" }} />
            );
            backgroundColor = "orange";
            break;
          case "confirmé":
            icon = (
              <CheckCircleOutline
                style={{ color: "white", fontSize: "1rem" }}
              />
            );
            backgroundColor = "green";
            break;
          case "attent de reception":
            icon = (
              <ErrorOutline style={{ color: "white", fontSize: "1rem" }} />
            );
            backgroundColor = "red";
            break;
          default:
            icon = null;
            backgroundColor = "transparent";
        }

        return (
          <span
            style={{
              display: "inline-block",
              alignItems: "center",
              color: "white",
              backgroundColor: backgroundColor,
              borderRadius: "4px",
              padding: "5px 10px",
              lineHeight: "1",
            }}
          >
            {icon} {status}
          </span>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            onClick={() => handleDetails(params.row._id)}
            aria-label="details"
          >
            <InfoIcon />
          </IconButton>
          <IconButton
            onClick={() => handleEdit(params.row._id)}
            aria-label="edit"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => handleEmail(params.row._id)}
            aria-label="email"
          >
            <EmailIcon />
          </IconButton>
          {generatePdf === true ? (
            <IconButton
              onClick={() => {
                setSelectedInvoiceId(params.row._id);
                setOpenDialog(true);
              }}
              aria-label="print"
            >
              <PrintIcon />
            </IconButton>
          ) : (
            ""
          )}
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

  const handleDetails = (id) => {
    window.location.href = `/${userName}/bon-livraison/details/${id}`;
  };

  const handlePrint = (id) => {
    navigate(`/${userName}/bon-livraison/imprimer/${id}`);
  };

  const handlePrintLetter = (id) => {
    navigate(`/${userName}/bon-livraison/imprimer/letter/${id}`);
  };

  const handleEmail = (id) => {
    navigate(`/${userName}/bon-livraison/email/${id}`);
  };

  const handleEdit = (id) => {
    window.location.href = `/${userName}/bon-livraison/edit/${id}`;
  };

  const handleDelete = async (id) => {
    try {
      const thisBon = bonLivraison.find((b) => b._id === id);
      if (thisBon) {
        thisBon.active = false;
        const { data } = await updateBonLivraison({
          id,
          BonLivraisonData: thisBon,
        });
        if (data.success) {
          toast.success("Bon de livraison supprimé avec succès");
          setbonLivraison(bonLivraison.filter((b) => b._id !== id));
        } else {
          toast.error("Le bon de livraison né supprimé pas avec succès");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header
          title="BON DE LIVRAISON"
          subtitle="Liste des bon de livraison "
          total={bonLivraison ? bonLivraison.length : 0}
        />
        <Link to={`/${userName}/bon-livraison/new`}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddOutlinedIcon />}
            sx={{ mt: 3, mb: 2 }}
          >
            Ajoute de bon de livraison
          </Button>
        </Link>
      </FlexBetween>{" "}
      <Box
        height="80vh"
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
          loading={isLoading}
          getRowId={(row) => row._id}
          rows={bonLivraison}
          columns={columns}
          rowsPerPageOptions={[20, 50, 100]}
          pagination
          paginationMode="server"
          sortingMode="server"
          components={{ Toolbar: DataGridCustomToolbar }}
        />
      </Box>
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="print-dialog-title"
      >
        <DialogTitle
          id="print-dialog-title"
          sx={{ color: theme.palette.secondary[100] }}
        >
          Choisissez le type d'impression
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sélectionnez le type de document que vous souhaitez imprimer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handlePrint(selectedInvoiceId);
              handleDialogClose();
            }}
            sx={{ color: theme.palette.secondary[200] }}
          >
            Modéle simple
          </Button>
          <Button
            onClick={() => {
              handlePrintLetter(selectedInvoiceId);
              handleDialogClose();
            }}
            sx={{ color: theme.palette.secondary[200] }}
          >
            Modéle lettre head
          </Button>
          <Button
            onClick={handleDialogClose}
            sx={{ color: theme.palette.secondary[200] }}
            autoFocus
          >
            Annuler
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BonLivraison;
