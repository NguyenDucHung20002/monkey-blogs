import axios from "axios";
import { config } from "../utils/constants";

const apiGetNotification = async (token) => {
  try {
    const res = await axios
      .get(`${config.SERVER_HOST}/notification/me/notify`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .catch((err) => {
        console.log(err);
      });
    if (!res?.data.success){
      return null
    } 
    return res.data.data;
  } catch (error) {
    console.log("error:", error);
  }
};

export default apiGetNotification;
