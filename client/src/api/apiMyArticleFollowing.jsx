import axios from "axios";
import { config } from "../utils/constants";
import { toast } from "react-toastify";

const apiMyArticleFollowing = async (token) => {
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/article/?feed=following`,
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data) return response.data;
  } catch (error) {
    toast.error("Some thing was wrong!", {
      pauseOnHover: false,
      delay: 500,
    });
  }
};

export default apiMyArticleFollowing;
