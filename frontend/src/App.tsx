import { Navigate, Route, Routes } from "react-router-dom";
import { useState } from "react";

import './App.css';
import Home from "./pages/home";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Landing from "./pages/landing";
import AuthContext from "./context/authContext";
import AuthProvider from "./provider/authProvider";
import Testing from "./pages/testing";
import ForgetPassword from "./pages/forget-password";
import VerifyToken from "./pages/verify-token";
import ResetPassword from "./pages/reset-password";

function App() {
  const [accessToken, setAccessToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const acToken = window.localStorage.getItem("access_token");

  return (
    <div>
      <AuthContext.Provider
        value={{
          endDate,
          startDate,
          setEndDate,
          accessToken,
          setStartDate,
          refreshToken,
          setAccessToken,
          setRefreshToken,
        }}
      >
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={!acToken ? <Login /> : <Navigate to="/home" replace />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/verify-token" element={<VerifyToken />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/testing" element={<Testing />} />
          <Route
            path="/home"
            element={
              <AuthProvider>
                <Home />
              </AuthProvider>
            }
            />
        </Routes>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
