/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext } from "react";

const AuthContext = createContext({
  accessToken: "",
  refreshToken: "",
  setAccessToken: (token: string) => {},
  setRefreshToken: (token: string) => {},
});

export default AuthContext;
