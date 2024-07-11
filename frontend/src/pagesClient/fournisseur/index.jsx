import React, { useEffect, useState } from "react";

import { Box, useTheme, IconButton, Button,  useMediaQuery } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {useUpdateFournisseurMutation} from "state/api";
import Header from "componementClient/Header";
import DataGridCustomToolbar from "componementClient/DataGridCustomToolbar";
import PersonIcon from "@mui/icons-material/Person";
import FlexBetween from "componentsAdmin/FlexBetween";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Fournisseurs = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const id = localStorage.getItem("userId");
  const isSmallScreen = useMediaQuery('(max-width: 820px)');
  const userName = localStorage.getItem("userName");
  const [Fourinsseur, setFourinsseur] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/Api/Fournisseur/Entreprise/${id}`);
        setFourinsseur(response.data);
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
  const [updateFournisseur] = useUpdateFournisseurMutation();
  const columns = [
    {
      field: "name",
      headerName: "Nom",
      flex: 1,
      renderCell: (params) => {
        const name = params.value;
        let icon = <PersonIcon style={{ fontSize: "1rem" }} />;
        return (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "0px 0.2rem",
            }}
          >
            {icon}
            <span style={{ marginLeft: "0.25rem", fontSize: "0.8rem" }}>
              {name}
            </span>
          </div>
        );
      },
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "phone",
      headerName: "Téléphone",
      flex: 1,
    },
    {
      field: "address",
      headerName: "Addresse",
      flex: 1,
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
    window.location.href = `/${userName}/fournisseurs/edit/${id}`;
  };

  const handleDelete = async (id) => {
    try {
      const thisFournisseur = Fourinsseur.find((f) => f._id === id)
      if(thisFournisseur) {
        thisFournisseur.active = false
        const {data} = await updateFournisseur({id, fournisseur: thisFournisseur})
        if(data.success) {
          toast.success("La suppresion de fournisseur se passe correctement");
          setFourinsseur(Fourinsseur.filter((f) => f._id !== id));
        } else {
          toast.error("La suppresion de fournisseur ne s'est pas passé correctement");
        }
      }
      // window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header
          title="FOURNISSEURS"
          subtitle="Liste des fournisseus"
          total={Fourinsseur ? Fourinsseur.length : 0}
        />
        <Link to={`/${userName}/fournisseurs/new`}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddOutlinedIcon />}
            sx={{ 
              mt: 3, 
              mb: 2,
              fontSize: isSmallScreen ? "11px" : "14px",
              fontWeight: "bold",
              padding: isSmallScreen ? "8px 14px" : "10px 20px",
             }}
          >
            Ajoute de fournisseur
          </Button>
        </Link>
      </FlexBetween>

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
          loading={isLoading }
          getRowId={(row) => row._id}
          rows={Fourinsseur}
          columns={columns}
          rowsPerPageOptions={[20, 50, 100]}
          pagination
          paginationMode="server"
          sortingMode="server"
          components={{ Toolbar: DataGridCustomToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Fournisseurs;
