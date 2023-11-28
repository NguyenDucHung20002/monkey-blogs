// SocketContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./auth-context";
import { apiGetNotification } from "../api/api";

const SocketContext = createContext();
export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const { userInfo } = useAuth();
  const userName = userInfo?.data?.username;
  const token = localStorage.getItem("token");

  async function fetchNotification() {
    const profileUser = await apiGetNotification(token);
    setNotifications(profileUser);
  }

  // useEffect(() => {
  //   const newSocket = io("http://localhost:5000");
  //   if (newSocket) return;
  //   setSocket(newSocket);
  //   fetchNotification();
  //   return () => {
  //     newSocket.disconnect();
  //   };
  // }, []);

  useEffect(() => {
    socket?.emit("newUser", { userName });
    socket?.on("getNotification", (data) => {
      setNotifications(data);
    });
    socket?.on("error", (data) => {
      setError(data);
    });
  }, [socket]);

  useEffect(() => {
    if (error) {
      console.log("Error Socket:", error);
    }
  }, [error]);

  const sendNotification = (receiverName, type, slug) => {
    socket.emit("sendNotification", {
      senderName: userName,
      receiverName,
      type,
      slug,
    });
  };

  const value = {
    socket,
    sendNotification,
    notifications,
  };
  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}
