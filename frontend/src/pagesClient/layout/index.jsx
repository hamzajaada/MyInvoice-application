import React, { useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "componementClient/Navbar";
import Sidebar from "componementClient/Sidebar";
import { useGetUserQuery } from "state/api";

const Layout = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // boolean for knowing the state of sidebar
  const userId = localStorage.getItem('userId');
  const { data } = useGetUserQuery(userId);//get data with the id in state
  //console.log("Data de l'entreprise",data);
  return (
    <Box  display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
    <Sidebar
      user={data || {}}
      isNonMobile={isNonMobile}
      drawerWidth="250px"
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
    />
      <Box flexGrow={1}>
        <Navbar 
        user={data || {}}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}/>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout ;
