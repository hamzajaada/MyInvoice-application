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
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "componementClient/Header";
import { useGetOnePackQuery, useUpdateBonCommandeMutation } from "state/api";
// import DataGridCustomToolbar from "componementClient/DataGridCustomToolbar";
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
import FlexBetween from "componentsAdmin/FlexBetween";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const BonCommandes = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const packId = localStorage.getItem("packId");
  const id = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const formPdf = "6630fdb21c1fec2176ead2c1";
  const { data: packData } = useGetOnePackQuery(packId);
  const [bonCommandes, setBonCommandes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [generatePdf, setGeneratePdf] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const isNonMobile = useMediaQuery("(min-width: 1000px)");

  useEffect(() => {
    if (packData) {
      setGeneratePdf(
        packData.services.some((service) => service.serviceId._id === formPdf)
      );
    }
  }, [packData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/Api/BonCommandes/List/${id}`
        );
        setBonCommandes(response.data);
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
  const [updateBonCommandes] = useUpdateBonCommandeMutation();

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
      headerName: "Numéro",
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
      field: "fournisseurId",
      headerName: "Fournisseur",
      flex: 0.7,
      renderCell: (params) => params.row.fournisseurId.name,
    },
    {
      field: "date",
      headerName: "Date de création",
      flex: 0.7,
      renderCell: (params) => formatDate(params.value),
    },
    {
      field: "dueDate",
      headerName: "Date d'échéance",
      flex: 0.5,
      renderCell: (params) => formatDate(params.value),
    },
    {
      field: "items",
      headerName: "Produits",
      flex: 0.4,
      sortable: false,
      renderCell: (params) => {
        // Sum the quantities of all items in the array
        const totalQuantity = params.value.reduce(
          (acc, curr) => acc + curr.quantity,
          0
        );
        return totalQuantity;
      },
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
      flex: 0.5,
      renderCell: (params) => {
        const status = params.value;
        let icon, backgroundColor;

        switch (status) {
          case "attent de traitement":
            icon = (
              <HourglassEmpty style={{ color: "white", fontSize: "1rem" }} />
            );
            backgroundColor = "orange";
            break;
          case "au cour de traitement":
            icon = (
              <CheckCircleOutline
                style={{ color: "white", fontSize: "1rem" }}
              />
            );
            backgroundColor = "green";
            break;
          case "expédié":
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
    window.location.href = `/${userName}/bon-commandes/details/${id}`;
  };

  const handlePrint = (id) => {
    navigate(`/${userName}/bon-commandes/imprimer/${id}`);
  };

  const handlePrintLetter = (id) => {
    navigate(`/${userName}/bon-commandes/imprimer/letter/${id}`);
  };

  const handleEmail = (id) => {
    navigate(`/${userName}/bon-commandes/email/${id}`);
  };

  const handleEdit = (id) => {
    window.location.href = `/${userName}/bon-commandes/edit/${id}`;
  };

  const handleDelete = async (id) => {
    try {
      const thisBon = bonCommandes.find((b) => b._id === id);
      if (thisBon) {
        thisBon.active = false;
        const { data } = await updateBonCommandes({
          id,
          bonCommandeData: thisBon,
        });
        if (data.success) {
          toast.success("Bon de commande supprimé avec succès");
          setBonCommandes(bonCommandes.filter((b) => b._id !== id));
        } else {
          toast.error("Le bon de commande né supprimé pas avec succès");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const isNoMobile = useMediaQuery("(min-width: 500px)");

  return (
    <Box m="1.5rem 2.5rem">
      {isNoMobile ? (
        <FlexBetween>
          <Header
            title="BON DE COMMANDES"
            subtitle="Liste des bon de commandes "
            total={bonCommandes ? bonCommandes.length : 0}
          />
          <Link to={`/${userName}/bon-commandes/new`}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddOutlinedIcon />}
              sx={{ mt: 3, mb: 2 }}
            >
              Ajoute de bon de commandes
            </Button>
          </Link>
        </FlexBetween>
      ) : (
        <>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Header
              title="BON DE COMMANDES"
              subtitle="Liste des bon de commandes "
              total={bonCommandes ? bonCommandes.length : 0}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Link to={`/${userName}/bon-commandes/new`}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddOutlinedIcon />}
                sx={{ mt: 3, mb: 2 }}
              >
                Ajoute de bon de commandes
              </Button>
            </Link>
          </Box>
        </>
      )}
      <Box
        mt="40px"
        height="75vh"
        sx={{
          overflowX: "auto",
          "& .MuiDataGrid-root": {
            border: "none",
            minWidth: isNonMobile ? "none" : "1000px",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
            backgroundColor: theme.palette.background.test,
            lineHeight: "2rem",
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
          rows={bonCommandes}
          columns={columns}
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

export default BonCommandes;
