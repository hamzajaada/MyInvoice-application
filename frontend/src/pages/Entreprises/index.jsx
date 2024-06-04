import React, { useState, useEffect } from "react";
import {
  Box,
  useTheme,
  IconButton,
  Avatar,
} from "@mui/material";
import { useUpdateEntrepriseStatusMutation } from "state/api";
import Header from "componentsAdmin/Header";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Entreprises = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [entreprises, setEntreprises] = useState([]);
  const [updateEntreprise] = useUpdateEntrepriseStatusMutation();

  useEffect(() => {
    const fetchEntreprises = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/Api/Entreprise"
        );
        setEntreprises(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    fetchEntreprises();
  }, []);

  const handleEdit = (id) => {
    navigate(`/Enterprises/Details/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const {data} = await updateEntreprise({ id });
      if(data.success) {
        toast.success("Entreprise supprimé avec succès");
      } else {
        toast.error("L'entreprise ne pas supprimé avec succès");
      }
      setEntreprises(entreprises.filter((entreprise) => entreprise._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const renderAvatarCell = (params) => {
    const { logo, name } = params.row;
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Avatar src={`${logo.url}`} alt={name} sx={{ width: 35, height: 35 }} />
        <Box ml={1}>
          <div>{name}</div>
        </Box>
      </Box>
    );
  };

  const columns = [
    {
      field: "name",
      headerName: "Entreprise",
      flex: 0.5,
      renderCell: renderAvatarCell,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 0.5,
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 0.5,
    },
    {
      field: "address",
      headerName: "Address",
      flex: 0.8,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.3,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            onClick={() => handleEdit(params.row._id)}
            aria-label="edit"
          >
            <InfoOutlinedIcon />
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

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="ENTREPRISES" subtitle="Liste d'entreprises" />
      <Box
        mt="40px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
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
          loading={isLoading || entreprises.length === 0}
          getRowId={(row) => row._id}
          rows={entreprises}
          columns={columns}
        />
      </Box>
    </Box>
  );
};

export default Entreprises;
