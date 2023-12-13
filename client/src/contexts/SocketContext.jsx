/* eslint-disable react/prop-types */
// SocketContext.js
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { io } from "socket.io-client";
import { useAuth } from "./auth-context";
import { apiGetNotification } from "../api/api";

const SocketContext = createContext();
// eslint-disable-next-line react-refresh/only-export-components
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

  const fetchNotification = useCallback(async () => {
    const profileUser = await apiGetNotification(token);
    setNotifications(profileUser);
  }, [token]);

  useEffect(() => {
    if (!token) return;
    const newSocket = io("http://localhost:8080");
    if (!newSocket) return;
    setSocket(newSocket);
    fetchNotification();
    return () => {
      newSocket.disconnect();
    };
  }, [fetchNotification, token]);

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

  const value = {
    socket,
    notifications,
  };
  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}
