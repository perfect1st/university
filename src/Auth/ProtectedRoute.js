import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getToken , getUserCookie } from "../hooks/authCookies";

const ProtectedRoute = () => {
  const user = getUserCookie();
  const token = getToken();

  // if (!user || !token) {
  //   return <Navigate to="/login" replace />;
  // }

  return <Outlet />;
};

export default ProtectedRoute;
