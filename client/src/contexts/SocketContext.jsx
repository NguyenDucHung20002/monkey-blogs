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
import { apiGetNotification, apiMarkAsReadNotification } from "../api/api";
import { apiDeleteAllNotification } from "../api/apiNew";
import { config } from "../utils/constants";

const SocketContext = createContext();
// eslint-disable-next-line react-refresh/only-export-components
export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [countUnRead, setCountUnRead] = useState(0);
  const { userInfo } = useAuth();
  const token = localStorage.getItem("token");
  const [hasRunOne, setHasRunOne] = useState(false);

  useEffect(() => {
    if (notifications) {
      let count = 0;
      notifications.forEach((notify) => {
        if (!notify?.isRead) count++;
      });
      setCountUnRead(count);
    }
  }, [notifications]);

  const fetchNotification = useCallback(async () => {
    const notificationResponse = await apiGetNotification(token);
    setNotifications(notificationResponse);
  }, [token]);
  const handleClearNotifications = useCallback(async () => {
    const response = await apiDeleteAllNotification();
    if (response?.success) {
      setNotifications([]);
    }
  }, [token]);
  const handleReadNotify = useCallback(async () => {
    await apiMarkAsReadNotification();
    fetchNotification(token);
  }, []);

  useEffect(() => {
    if (!token) return;
<<<<<<< HEAD
    const newSocket = io(config.SERVER_HOST);
=======
    const newSocket = io("http://178.128.21.84:8080");
>>>>>>> 420418f5f6c0ca05a85d021a4f5a6d6adb8ccc61
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
      if (!data) return;
      // setNotifications((prev) => [data, ...prev]);
      fetchNotification();
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
    countUnRead,
    handleReadNotify,
    handleClearNotifications,
  };
  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}
