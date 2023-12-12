// SocketContext.js
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
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
  const token = localStorage.getItem("token");
  const [hasRunOne, setHasRunOne] = useState(false);

  async function fetchNotification() {
    const profileUser = await apiGetNotification(token);
    setNotifications(profileUser);
  }

  useEffect(() => {
    if (!token) return;
    const newSocket = io("http://localhost:8080");
    if (!newSocket) return;
    setSocket(newSocket);
    fetchNotification();
    return () => {
      newSocket.disconnect();
    };
  }, [token]);

  useEffect(() => {
    const userId = userInfo?.data?.id;
    if (!userId) return;
    if (!socket) return;
    if (!hasRunOne) {
      socket?.emit("new-user", { userId });
      setHasRunOne(true);
    }
    // socket?.emit("new-user", userId);
    socket?.on("notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });
    socket?.on("error", (data) => {
      setError(data);
    });
  }, [socket, userInfo]);

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
