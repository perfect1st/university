import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { getUserCookie } from "../hooks/authCookies";
import { Navigate, Outlet, useLocation, useSearchParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GET_LOGGED_USER_BY_TOKEN } from "../graphql/usersQueries";
import { useDispatch, useSelector } from "react-redux";
import { storeLoggedUser } from "../redux/slices/user/userSlice";
import logger from "../utils/logger";

const MainLayout = ({ isLoggedIn=false ,children }) => {
 const location = useLocation();
  const theme = useTheme();
   const dispatch = useDispatch();

 const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const[searchParams,setSearchParams]=useSearchParams();

 

 const {
     data: { me } = {},
     loading: userLoading,
     error: userError,
   } = useQuery(GET_LOGGED_USER_BY_TOKEN, { fetchPolicy: "network-only" });

//  

  useEffect(() => {
     if(me?.id){
       dispatch(storeLoggedUser(me)); 
     }
   },[me]);
 


 


  

  const loggedUser=useSelector(state=>state.user.loggedUser);

   logger.log('me',me);

  // if(isLoggedIn && !me && !userLoading  ) return <Navigate to="/home" />

  // const user = me;
     const user = getUserCookie();
     const isAuthenticated = Boolean(user);

     logger.log("loggedUser",loggedUser)

     if((isLoggedIn && !isAuthenticated && me==null)  ) return <Navigate to="/home" />
       
     
  logger.log('isAuthenticated',isAuthenticated);

  const hideSecandHeader = location.pathname == "/home" || location.pathname == "/visionsArticals" || location.pathname == "/news" || location.pathname.includes("/ArticalDetails/");

 // const hideSecandHeader=false;
logger.log("hideSecandHeader",!hideSecandHeader)
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
     {isAuthenticated && !hideSecandHeader &&<Sidebar  />}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* Header لو عندك */}
        <Box component="main" sx={{ flex: 1 }}>
          {children}
        </Box>
      </Box>

      <Outlet />
    </Box>
  );
};

export default MainLayout;
