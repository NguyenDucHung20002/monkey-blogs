import React, { useEffect } from "react";
import { config } from "../utils/constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

const { createContext, useContext, useState } = React;

const AuthContext = createContext();
function AuthProvider(props) {
  const [userInfo, setUserInfo] = useState({});
  const value = { userInfo, setUserInfo };
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      localStorage.setItem("token", tokenParam);
      setSearchParams("");
    }
    const token = localStorage.getItem("token");
    if (!token) navigate("/sign-in");
    async function fetcher() {
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
        if (response.data) setUserInfo(response.data);
      } catch (error) {
        if (error.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/sign-in");
        }
      }
    }
    fetcher();
  }, [navigate, searchParams, setSearchParams]);

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
