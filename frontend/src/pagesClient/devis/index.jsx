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
import { useGetOnePackQuery, useUpdateDeviMutation } from "state/api";
import Header from "componementClient/Header";
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

const Devis = () => {
  const navigate = useNavigate();
  if (!localStorage.getItem("userId")) {
    navigate("/");
  }
  const theme = useTheme();
  const packId = localStorage.getItem("packId");
  const id = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const formPdf = "6630fdb21c1fec2176ead2c1";
  const { data: packData } = useGetOnePackQuery(packId);
  const [Devis, setDevis] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [generatePdf, setGeneratePdf] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const isNonMobile = useMediaQuery("(min-width: 1000px)");
  const isNoMobile = useMediaQuery("(min-width: 680px)");

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
          `http://localhost:3001/Api/Devi/List/${id}`
        );
        setDevis(response.data);
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
  const [updateDevi] = useUpdateDeviMutation();
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
      headerName: "Numéro de devi",
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
      field: "clientId",
      headerName: "Client",
      flex: 0.8,
      renderCell: (params) => params.row.clientId.name,
    },
    {
      field: "date",
      headerName: "Date de création",
      flex: 0.7,
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
      flex: 0.7,
      renderCell: (params) => {
        const status = params.value;
        let icon, backgroundColor;

        switch (status) {
          case "attente d'approbation":
            icon = (
              <HourglassEmpty style={{ color: "white", fontSize: "1rem" }} />
            );
            backgroundColor = "orange";
            break;
          case "approuvé":
            icon = (
              <CheckCircleOutline
                style={{ color: "white", fontSize: "1rem" }}
              />
            );
            backgroundColor = "green";
            break;
          case "rejeté":
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
    window.location.href = `/${userName}/devis/details/${id}`;
  };

  const handlePrint = (id) => {
    navigate(`/${userName}/devis/imprimer/${id}`);
  };

  const handlePrintLetter = (id) => {
    navigate(`/${userName}/devis/imprimer/letter/${id}`);
  };

  const handlePrintClassic = (id) => {
    navigate(`/${userName}/devis/imprimer/classic/${id}`);
  };

  const handleEmail = (id) => {
    navigate(`/${userName}/devis/email/${id}`);
  };

  const handleEdit = (id) => {
    window.location.href = `/${userName}/devis/edit/${id}`;
  };

  const handleDelete = async (id) => {
    try {
      const thisDevi = Devis.find((d) => d._id === id);
      if (thisDevi) {
        thisDevi.active = false;
        const { data } = await updateDevi({ id, deviData: thisDevi });
        if (data.success) {
          toast.success("Le Devi a été supprimé avec succès");
          setDevis(Devis.filter((d) => d._id !== id));
        } else {
          toast.error("La suppresion de Devi a échoué");
        }
      }
      // window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <Box m="1.5rem 2.5rem">
      {isNoMobile ? (
      <FlexBetween>
        <Header
          title="DEVIS"
          subtitle="Liste des bons des "
          total={Devis ? Devis.length : 0}
        />
        <Link to={`/${userName}/devis/new`}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddOutlinedIcon />}
            sx={{ mt: 3, mb: 2 }}
          >
            Ajouter un Devi
          </Button>
        </Link>
      </FlexBetween>
      ) : (
        <>
          <Box sx={{ display: "flex"}}>
            <Header
              title="DEVIS"
              subtitle="Liste des bons des "
              total={Devis ? Devis.length : 0}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Link to={`/${userName}/devis/new`}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddOutlinedIcon />}
                sx={{ mt: 3, mb: 2 }}
              >
                Ajouter un Devi
              </Button>
            </Link>
          </Box>
        </>
    )}
      <Box
      mt={1}
      height="80vh"
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
          loading={isLoading || !Devis}
          getRowId={(row) => row._id}
          rows={Devis}
          columns={columns}
          rowsPerPageOptions={[20, 50, 100]}
          pagination
          paginationMode="server"
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
            Sélectionnez le modèle que vous souhaitez imprimer.
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
            onClick={() => {
              handlePrintClassic(selectedInvoiceId);
              handleDialogClose();
            }}
            sx={{ color: theme.palette.secondary[200] }}
          >
            Modèle Classique
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

export default Devis;
