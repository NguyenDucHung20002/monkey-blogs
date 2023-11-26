import axios from "axios";
import { config } from "../utils/constants";
import { toast } from "react-toastify";

const apiAddTopic = async (token, name) => {
  try {
    const response = await axios.post(
      `${config.SERVER_HOST}/topic`,
      { name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.success) {
      toast.success("Add successfully!", {
        pauseOnHover: false,
        delay: 300,
      });
      return true;
    }
  } catch (error) {
    if (error.response.status === 409)
      return toast.error(error.response.data.message, {
        pauseOnHover: false,
        delay: 500,
      });

    toast.error("Some thing was wrong!", {
      pauseOnHover: false,
      delay: 500,
    });
  }
};

export default apiAddTopic;
