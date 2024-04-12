import { config } from "../utils/constants";
import axios from "axios";
import { fetchAccessToken } from "../api/apiHa";

const customAxios = axios.create({
  baseURL: config.SERVER_HOST,
});

let accessToken = localStorage.getItem("token");

const AxiosInterceptorsSetup = (navigate) => {
  customAxios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const newAccessToken = await fetchAccessToken();

          localStorage.setItem("token", newAccessToken);

          accessToken = newAccessToken;

          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          return customAxios(originalRequest);
        } catch (refreshTokenError) {
          localStorage.removeItem("token");
          navigate("/sign-in");
          return Promise.reject(refreshTokenError);
        }
      }
      return Promise.reject(error);
    }
  );
};

export { AxiosInterceptorsSetup, customAxios };
