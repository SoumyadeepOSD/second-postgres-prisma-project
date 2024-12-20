/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext } from "react";

const AuthContext = createContext({
  accessToken: "",
  refreshToken: "",
  setAccessToken: (token: string) => { },
  setRefreshToken: (token: string) => { },
  startDate: undefined as Date | undefined,
  setStartDate: (startTime: Date | undefined) => {},
  endDate: undefined as Date | undefined,
  setEndDate: (endTime: Date | undefined) => {},
});

export default AuthContext;
