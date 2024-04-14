import React, { useCallback, useEffect } from "react";
import { config } from "../utils/constants";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { customAxios } from "../config/axios-customize";

const { createContext, useContext, useState } = React;

const AuthContext = createContext();

const AuthProvider = React.memo((props) => {
  const [userInfo, setUserInfo] = useState({});
  const value = { userInfo, setUserInfo };

  function getToken() {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl);
      window.history.replaceState({}, document.title, window.location.pathname);
      return tokenFromUrl;
    }

    const tokenLocal = localStorage.getItem("token");
    if (tokenLocal) return tokenLocal;
    return null;
  }

  const token = getToken();

  const fetcher = async () => {
    try {
      const response = await customAxios.get(
        `${config.SERVER_HOST}/profile/logged-in-profile-information`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data?.success) {
        setUserInfo(response.data);
      }
      return null;
    } catch (error) {}
  };

  useEffect(() => {
    fetcher();
  }, []);

  return <AuthContext.Provider value={value} {...props}></AuthContext.Provider>;
});

function useAuth() {
  const context = useContext(AuthContext);
  if (typeof context === "undefined")
    throw new Error("useUser must be used within UserProvider");
  return context;
}

export { AuthProvider, useAuth };
