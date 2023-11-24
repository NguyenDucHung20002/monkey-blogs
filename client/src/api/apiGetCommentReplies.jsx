import axios from "axios";
import { config } from "../utils/constants";

const apiGetCommentReplies = async (slug, parentCommentId) => {
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/comment/${slug}/${parentCommentId}/replies `,
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

export default apiGetCommentReplies;
