import React, { useEffect, useState } from "react";
import { Box, useTheme, IconButton, useMediaQuery } from "@mui/material";
import axios from "axios"; 
import Header from "componentsAdmin/Header";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import AddTaskOutlinedIcon from '@mui/icons-material/AddTaskOutlined';
import { useUpdateMessageMutation } from "state/api";
import { toast } from "react-toastify";

const Messages = () => {
  const navigate = useNavigate();
  if (!localStorage.getItem("userId")) {
    navigate("/");
  }
  const [messages, setMessages] = useState([]);
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width: 1000px)");
  const [updateMessage] = useUpdateMessageMutation();
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get("http://localhost:3001/Api/Message/");
        setMessages(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    try {
      const {data} = await axios.delete(`http://localhost:3001/Api/Message/remove/${id}`);
      if(data.success) {
        toast.success("Message supprimé avec succès");
      } else {
        toast.error("Le message ne pas supprimé avec succès");
      }
      setMessages(messages.filter((message) => message._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditAccept = async (id) => {
    const thisMessage = messages.find((message) => message._id === id);
    if(thisMessage) {
      thisMessage.status = "accepter";
      const {data} = await updateMessage({ id, MessageData : thisMessage });
      if(data.success) {
        toast.success("Message accepté avec succès");
      } else {
        toast.error("Le message né accpeté pas avec succès");
      }
    }
  };

  const columns = [
    {
      field: "enterpriseName",
      headerName: "Entreprise",
      flex: 1,
    },
    {
      field: "message",
      headerName: "Message",
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "Date d'envoie",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.6,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.4,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            onClick={() => handleEditAccept(params.row._id)}
            aria-label="edit"
          >
            <AddTaskOutlinedIcon />
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
      <Header title="MESSAGES" subtitle="Liste de messages" />
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
          loading={!messages.length}
          getRowId={(row) => row._id}
          rows={messages || []}
          columns={columns}
        />
      </Box>
    </Box>
  );
};

export default Messages;
