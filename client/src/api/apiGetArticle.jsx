import axios from "axios";
import { config } from "../utils/constants";

const apiGetArticle = async (slug) => {
  try {
    const response = await axios.get(`${config.SERVER_HOST}/article/${slug} `, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.data) return response.data;
  } catch (error) {
    if (error.response.status === 404) {
      return null;
    }
  }
};

export default apiGetArticle;
