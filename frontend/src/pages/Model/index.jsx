import React, { useEffect, useState } from "react";
import { Box, useTheme, Button, IconButton, Avatar } from "@mui/material";
import { useUpdateModelActiveMutation } from "state/api";
import Header from "componentsAdmin/Header";
import { DataGrid } from "@mui/x-data-grid";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import FlexBetween from "componentsAdmin/FlexBetween";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useMediaQuery } from "@mui/material";

const Models = () => {
  const navigate = useNavigate();
  if (!localStorage.getItem("userId")) {
    navigate("/");
  }
  const [model, setModel] = useState({
    _id: "",
    name: "",
    icon: "",
    description: "",
  });
  const [updateModel] = useUpdateModelActiveMutation();
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width: 400px)");
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await axios.get("http://localhost:3001/Api/Model/");
        setModel(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchModels();
  }, []);

  const columns = [
    {
      field: "Model",
      headerName: "Model",
      flex: 0.6,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* <Avatar src={`https://my-invoice-api.vercel.app/Images/${params.row.icon}`} alt={params.row.name} /> */}
          <Avatar src={`${params.row.icon.url}`} alt={params.row.name} />
          <Box ml={1}>
            <div>{params.row.name}</div>
          </Box>
        </Box>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.2,
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
    window.location.href = `/Models/edit/${id}`;
  };

  const handleDelete = async (id) => {
    try {
      const thisModel = model.find((m) => m._id === id);
      if (thisModel) {
        const { data } = await updateModel({
          id: thisModel._id,
          model: { ...thisModel, active: false },
        });
        if (data.success) {
          toast.success("Demande supprimé avec succès");
          setModel(model.filter((m) => m._id !== id));
        } else {
          toast.error("La demande ne pas supprimé avec succès");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      {isNonMobile ? (
        <FlexBetween>
          <Header title="MODELS" subtitle="Liste de models" />
          <Link to="/Models/new">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddOutlinedIcon />}
              sx={{ mt: 3, mb: 2 }}
            >
              Ajoute de model
            </Button>
          </Link>
        </FlexBetween>
      ) : (
        <>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Header title="MODELS" subtitle="Liste de models" />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Link to="/Models/new">
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddOutlinedIcon />}
                sx={{ mt: 3, mb: 2 }}
              >
                Ajoute de model
              </Button>
            </Link>
          </Box>
        </>
      )}

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
          loading={!model.length}
          getRowId={(row) => row._id}
          rows={model || []}
          columns={columns}
        />
      </Box>
    </Box>
  );
};

export default Models;
