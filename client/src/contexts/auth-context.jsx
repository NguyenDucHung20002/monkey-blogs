import React, { useEffect } from "react";
import { apiGetLoginInformation } from "../api/apiHa";

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
    const response = await apiGetLoginInformation(token);
    if (response) {
      setUserInfo(response);
    }
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
