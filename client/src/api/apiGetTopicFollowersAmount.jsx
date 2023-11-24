import axios from "axios";
import { config } from "../utils/constants";

const apiGetTopicFollowersAmount = async (slug) => {
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/topic/${slug}/followers/amount`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data) return response.data;
  } catch (error) {
    console.log("error:", error);
  }
};

export default apiGetTopicFollowersAmount;
