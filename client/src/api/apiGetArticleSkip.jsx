import axios from "axios";
import { config } from "../utils/constants";
import { toast } from "react-toastify";

const apiGetArticleSkip = async (skipId, token) => {
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/article/?skip=${skipId}&limit=${5}`,
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data) return response.data;
  } catch (error) {
    console.log("error:", error);
    toast.error("Some thing was wrong!", {
      pauseOnHover: false,
      delay: 500,
    });
  }
};

export default apiGetArticleSkip;
