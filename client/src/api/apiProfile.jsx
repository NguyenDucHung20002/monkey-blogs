import axios from "axios";
import { config } from "../utils/constants";

const apiProfile = async (token, username) => {
  try {
    const res = await axios
      .get(`${config.SERVER_HOST}/api/user/${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .catch((err) => {
        console.log(err);
      });
    if (res.data) return res.data;
  } catch (error) {
    console.log("error:", error);
  }
};

export default apiProfile;
