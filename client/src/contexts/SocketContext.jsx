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
import { apiGetNotifications, apiMartAllNotificationsAsRead } from "../api/api";
import { apiClearReadNotifications } from "../api/apiNew";
import { config } from "../utils/constants";

const SocketContext = createContext();
// eslint-disable-next-line react-refresh/only-export-components
export function useSocket() {
  return useContext(SocketContext);
}

const SocketProvider = ({ children }) => {
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
    const response = await apiGetNotifications(token);
    setNotifications(response.data);
  }, [token]);

  const handleClearNotifications = useCallback(async () => {
    const response = await apiClearReadNotifications(token);
    if (response) {
      setNotifications([]);
    }
  }, [token]);

  const handleReadNotify = useCallback(async () => {
    await apiMartAllNotificationsAsRead(token);
    fetchNotification(token);
  }, []);

  useEffect(() => {
    if (!token) return;
    const newSocket = io(config.SOCKET_HOST);
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
};

export default SocketProvider;
