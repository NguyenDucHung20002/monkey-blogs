import axios from "axios";
import { config } from "../utils/constants";
import { toast } from "react-toastify";

const apiUpdateArticle = async (token, slug, formData) => {
  try {
    const response = await axios.put(
      `${config.SERVER_HOST}/article/${slug}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.data.success) return true;
  } catch (error) {
    if (error.response.status == 404) {
      toast.error("Post not found!", {
        pauseOnHover: false,
        delay: 500,
      });
    }
  }
};

export default apiUpdateArticle;
