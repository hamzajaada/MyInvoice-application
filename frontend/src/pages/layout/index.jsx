import React, { useState, useEffect } from 'react';
import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "componentsAdmin/Navbar";
import Sidebar from "componentsAdmin/Sidebar";
import axios from 'axios'; // Importez axios

const Layout = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [entreprise, setEntreprise] = useState({
    _id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "",
    logo: "",
  })
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const userId = localStorage.getItem('userId');

  useEffect(()=>{
    const fetchEntreprise = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/Api/Entreprise/${userId}`);
        setEntreprise(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    if(userId) {
      fetchEntreprise();
    }
  },[userId])

  return (
    <Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
      <Sidebar
        user = {entreprise && (entreprise || {})}
        isNonMobile={isNonMobile}
        drawerWidth="250px"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <Box flexGrow={1}>
        <Navbar  
          user = {entreprise && (entreprise || {})}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;
