import { Route, Routes } from "react-router-dom";
import { useState } from "react";

import './App.css';
import Home from "./pages/home";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Landing from "./pages/landing";
import AuthContext from "./context/authContext";
import AuthProvider from "./provider/authProvider";
import Testing from "./pages/testing";

function App() {
  const [accessToken, setAccessToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

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
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
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
