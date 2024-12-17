import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
// import AuthContext from "@/context/authContext";


const AuthProvider = ({ children }:{children:ReactNode}) => {
  const refreshToken = window.localStorage.getItem("refresh_token");
  
  if (!refreshToken) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AuthProvider;
