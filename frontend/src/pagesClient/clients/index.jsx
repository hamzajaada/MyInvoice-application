import React, { useEffect, useState } from "react";
import { useMediaQuery, Box, useTheme, IconButton, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useUpdateClientMutation } from "state/api";
import Header from "componementClient/Header";
import DataGridCustomToolbar from "componementClient/DataGridCustomToolbar";
import PersonIcon from '@mui/icons-material/Person';
import FlexBetween from "componentsAdmin/FlexBetween";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Clients  = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const id = localStorage.getItem('userId');
  const userName = localStorage.getItem("userName");
  // hadi
  const [Client, setClient] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const isNonMobile = useMediaQuery("(min-width: 1000px)");
  const isNoMobile = useMediaQuery("(min-width: 680px)");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/Api/Client/Entreprise/${id}`);
        setClient(response.data);
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
  const [updateClient] = useUpdateClientMutation();
  // const totalInvoices = data ? data.totalItems : 0;
  const columns = [
    
    {
      field: "name",
      headerName: "Nom",
      flex: 1,
      renderCell: (params) => {
        const name = params.value;
        let icon = <PersonIcon style={{fontSize: '1rem' }} />;
        return (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0px 0.2rem', 
            }}
          >
            {icon}
            <span style={{ marginLeft: '0.25rem', fontSize: '0.8rem',}}>{name}</span>
          </div>
        );
      }
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
    window.location.href = `/${userName}/clients/edit/${id}`;
  };
  
  const handleDelete = async (id) => {
    try {
      const thisClient = Client.find((c) => c._id === id) 
      if (thisClient) {
        thisClient.active = false
        const {data} = await updateClient({ id, client: thisClient });
        if(data.success) {
          toast.success("Le Client a été supprimé avec succès");
          setClient(Client.filter((c) => c._id !== id));
        } else {
          toast.error("La Suppresion du Client a échoué");
        }
      }
      // window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  

  return (
    <Box m="1.5rem 2.5rem">
      {isNoMobile ? (
      <FlexBetween>
      <Header title="CLIENTS" subtitle="Liste entier de vos "   total={Client ? Client.length : 0} />
        <Link to={`/${userName}/ajouterClient`}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddOutlinedIcon />}
            sx={{ mt: 3, mb: 2 }}
          >
            Ajouter un client
          </Button>
        </Link>
      </FlexBetween>
       ) : (
        <>
            <Box sx={{ display: "flex"}}>
              <Header
                title="CLIENTS"
                subtitle="Liste entier de vos "
                total={Client ? Client.length : 0}
              />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Link to={`/${userName}/ajouterClient`}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddOutlinedIcon />}
                  sx={{ mt: 3, mb: 2 }}
                >
                  Ajouter un client
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
          loading={isLoading}
          getRowId={(row) => row._id}
          rows={Client}
          columns={columns}
          // rowCount={(data && data.total) || 0}
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

export default Clients;