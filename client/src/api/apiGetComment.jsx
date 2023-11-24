import axios from "axios";
import { config } from "../utils/constants";

const apiGetComment = async (slug, token) => {
  try {
    const response = await axios.get(`${config.SERVER_HOST}/comment/${slug} `, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.data) return response.data;
  } catch (error) {
    console.log("error:", error);
  }
};

export default apiGetComment;
