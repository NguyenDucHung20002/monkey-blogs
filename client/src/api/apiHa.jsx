import { config } from "../utils/constants";
import axios from "axios";
import { toast } from "react-toastify";
import { customAxios } from "../config/axios-customize";

const fetchAccessToken = async () => {
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/auth/access-token`,
      { withCredentials: true },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      return response.data.access_token;
    }
  } catch (error) {
    console.log("Error:", error);
    throw new Error("Failed to fetch access token");
  }
};

const updateProfileDesign = async (token, design) => {
  try {
    const response = await customAxios.patch(
      `${config.SERVER_HOST}/profile/me/update/design`,
      { design },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

export { fetchAccessToken, updateProfileDesign };
