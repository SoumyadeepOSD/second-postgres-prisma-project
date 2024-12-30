import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
// import AuthContext from "@/context/authContext";


const AuthProvider = ({ children }:{children:ReactNode}) => {
  const accessToken = window.localStorage.getItem("access_token");
  
  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AuthProvider;

