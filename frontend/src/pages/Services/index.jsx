import React, { useState, useEffect } from "react";
import { Box, useTheme, Button, IconButton } from "@mui/material";
import { useGetAllServicesQuery, useRemoveServiceMutation } from "state/api";
import Header from "componentsAdmin/Header";
import { DataGrid } from "@mui/x-data-grid";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import FlexBetween from "componentsAdmin/FlexBetween";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Services = () => {
  
  const navigate = useNavigate()
  if(!localStorage.getItem('userId')) {
    navigate('/');
  }
  const [service, setService] = useState({
    _id: "",
    ServiceName: "",
  })
  const theme = useTheme();
  const [removeService] = useRemoveServiceMutation();
  // hadi
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("http://localhost:3001/Api/Service/");
        setService(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchServices();
  }, []);
 

  const columns = [
    {
      field: "ServiceName",
      headerName: "Service",
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
    window.location.href = `/Services/edit/${id}`;
  };

  const handleDelete = async (id) => {
    try {
      await removeService(id);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="SERVICES" subtitle="Liste de services" />
        <Link to="/Services/new">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddOutlinedIcon />}
            sx={{ mt: 3, mb: 2 }}
          >
            Add
          </Button>
        </Link>
      </FlexBetween>

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
          loading={!service.length}
          getRowId={(row) => row._id}
          rows={service || []}
          columns={columns}
        />
      </Box>
    </Box>
  );
};

export default Services;
