import React, { useEffect } from "react";
import { config } from "../utils/constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

const { createContext, useContext, useState } = React;

const AuthContext = createContext();
function AuthProvider(props) {
  const [userInfo, setUserInfo] = useState({});
  // console.log("userInfo:", userInfo);
  const value = { userInfo, setUserInfo };
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  function getToken() {
    const tokenParams = searchParams.get("token");
    if (tokenParams) {
      localStorage.setItem("token", tokenParams);
      return tokenParams;
    }
    const tokenLocal = localStorage.getItem("token");
    if (tokenLocal) return tokenLocal;
    return null;
  }
  const token = getToken();
  console.log("token:", token);

  useEffect(() => {
    async function fetcher() {
      if (!token) navigate("/sign-in");
      try {
        const response = await axios.post(
          `${config.SERVER_HOST}/auth/login`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response?.data?.success) {
          setUserInfo(response.data);
        } else {
          navigate("/sign-in");
        }
      } catch (error) {
        navigate("/sign-in");
      }
    }
    fetcher();
  }, [navigate, token]);

  return <AuthContext.Provider value={value} {...props}></AuthContext.Provider>;
}
function useAuth() {
  const context = useContext(AuthContext);
  if (typeof context === "undefined")
    throw new Error("useUser must be used within UserProvider");
  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider, useAuth };
