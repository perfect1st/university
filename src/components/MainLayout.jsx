import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Box } from "@mui/material";
import { getUserCookie } from "../hooks/authCookies";

const MainLayout = ({ children }) => {

  const user = getUserCookie();
  const isAuthenticated = Boolean(user); 

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
     {isAuthenticated && <Sidebar />}
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
