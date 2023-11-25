import axios from "axios";
import { config } from "../utils/constants";

const apiDeleteArticle = async (token, slug) => {
  try {
    const res = await axios
      .delete(`${config.SERVER_HOST}/article/${slug}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .catch((err) => {
        console.log(err);
      });
    if (!res?.data.success){
      return null
    } 
    return true;
  } catch (error) {
    console.log("error:", error);
  }
};

export default apiDeleteArticle;
