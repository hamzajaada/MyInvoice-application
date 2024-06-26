import React, { useEffect, useState } from "react";
import { Box, useTheme, IconButton } from "@mui/material";
import axios from "axios"; // Importer axios
import Header from "componentsAdmin/Header";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import AddTaskOutlinedIcon from '@mui/icons-material/AddTaskOutlined';
import { useUpdateMessageMutation } from "state/api";

const Messages = () => {
  const navigate = useNavigate();
  if (!localStorage.getItem("userId")) {
    navigate("/");
  }
  const [messages, setMessages] = useState([]);
  const theme = useTheme();
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
      await axios.delete(`http://localhost:3001/Api/Message/remove/${id}`);
      setMessages(messages.filter((message) => message._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditAccept = async (id) => {
    const thisMessage = messages.find((message) => message._id === id);
    if(thisMessage) {
      thisMessage.status = "accepter";
      await updateMessage({ id, MessageData : thisMessage });
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
