import axios from "axios";
import { config } from "../utils/constants";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const apiDeleteTopic = async (token, slug) => {
  try {
    const response = await axios.delete(`${config.SERVER_HOST}/topic/${slug}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.data.success) {
      toast.success("Add successfully!", {
        pauseOnHover: false,
        delay: 500,
      });
      return true;
    }
  } catch (error) {
    if (error.response.status === 409)
      return Swal.fire("Deleted!", "Your post has been deleted.", "success");

    toast.error("Some thing was wrong!", {
      pauseOnHover: false,
      delay: 500,
    });
  }
};

export default apiDeleteTopic;
