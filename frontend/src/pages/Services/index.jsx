import React, { useState, useEffect } from "react";
import { Box, useTheme, Button, IconButton } from "@mui/material";
import { useUpdateServiceMutation } from "state/api";
import Header from "componentsAdmin/Header";
import { DataGrid } from "@mui/x-data-grid";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import FlexBetween from "componentsAdmin/FlexBetween";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useMediaQuery } from "@mui/material";

const Services = () => {
  const navigate = useNavigate();
  if (!localStorage.getItem("userId")) {
    navigate("/");
  }
  const [service, setService] = useState({
    _id: "",
    ServiceName: "",
  });
  const theme = useTheme();
  const [updateService] = useUpdateServiceMutation();
  const isNonMobile = useMediaQuery("(min-width: 400px)");
  const isNoMobile = useMediaQuery("(min-width: 1000px)");
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
      const thisService = service.find((s) => s._id === id);
      if (thisService) {
        thisService.active = false;
        const { data } = await updateService({ id, ServiceData: thisService });
        if (data.success) {
          toast.success("Service supprimé avec succès");
          setService(service.filter((s) => s._id !== id));
        } else {
          toast.error("Le service ne pas supprimé avec succès");
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
          <Header title="SERVICES" subtitle="Liste de services" />
          <Link to="/Services/new">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddOutlinedIcon />}
              sx={{ mt: 3, mb: 2 }}
            >
              Ajoute de service
            </Button>
          </Link>
        </FlexBetween>
      ) : (
        <>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Header title="SERVICES" subtitle="Liste de services" />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Link to="/Services/new">
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddOutlinedIcon />}
                sx={{ mt: 3, mb: 2 }}
              >
                Ajoute de service
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
            minWidth: isNoMobile ? "none" : "1000px",
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
