import axios from "axios";
import { config } from "../utils/constants";
import { toast } from "react-toastify";

const apiGetTopic = async (token, slug) => {
  try {
    const response = await axios.get(`${config.SERVER_HOST}/topic/${slug}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.data.success) return response.data;
  } catch (error) {
    if (error.response.status == 404) {
      toast.error("Topic not found!", {
        pauseOnHover: false,
        delay: 500,
      });
    }
  }
};

export default apiGetTopic;
