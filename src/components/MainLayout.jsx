import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { getUserCookie } from "../hooks/authCookies";
import { useLocation, useSearchParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GET_LOGGED_USER_BY_TOKEN } from "../graphql/usersQueries";

const MainLayout = ({ children }) => {
 const location = useLocation();
  const theme = useTheme();

 const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const[searchParams,setSearchParams]=useSearchParams();

 const [isMobileOpen, setIsMobileOpen] = useState(false);

 useEffect(()=>{
  if(searchParams.get("mobileOpen")) setIsMobileOpen(searchParams.get("mobileOpen"));
 },[searchParams]);


 console.log('isMobile',isMobileOpen);

 const onClose=()=>{
   // localStorage.setItem()
   searchParams.set("mobileOpen",false);
   setSearchParams(searchParams);
   setIsMobileOpen(false);
 }
   const {
       data: {me}={},
       loading: userLoading,
       error: userError,
     } = useQuery(GET_LOGGED_USER_BY_TOKEN, { fetchPolicy: "network-only" });
  const user = me;

  const isAuthenticated = Boolean(me);

  console.log('isAuthenticated',isAuthenticated);

 // const hideSecandHeader = location.pathname == "/home" || location.pathname == "/visionsArticals" || location.pathname == "/news";

 const hideSecandHeader=false;
console.log("hideSecandHeader",!hideSecandHeader)
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
     {isAuthenticated && !hideSecandHeader &&<Sidebar mobileOpen={isMobileOpen} onClose={onClose} />}
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
