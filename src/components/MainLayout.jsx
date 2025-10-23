import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Box } from "@mui/material";
import { getUserCookie } from "../hooks/authCookies";
import { useLocation } from "react-router-dom";

const MainLayout = ({ children }) => {
 const location = useLocation();
  const user = getUserCookie();
  const isAuthenticated = Boolean(user); 
  const hideSecandHeader = location.pathname == "/home" || location.pathname == "/visionsArticals" || location.pathname == "/news";
console.log("user",user)
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
     {isAuthenticated && !hideSecandHeader &&<Sidebar />}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* Header لو عندك */}
        <Box component="main" sx={{ flex: 1 }}>
          {children}
        </Box>
      </Box>


    </Box>
  );
};

export default MainLayout;
