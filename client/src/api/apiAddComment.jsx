import axios from "axios";
import { config } from "../utils/constants";

const apiAddComment = async (slug, parentCommentId, content, token) => {
  if ((!slug, !parentCommentId, !content, !token)) return;
  try {
    const response = await axios.post(
      `${config.SERVER_HOST}/comment/${slug}`,
      {
        parentCommentId,
        content,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data) {
      return response.data;
    }
  } catch (error) {
    console.log("error:", error);
  }
};

export default apiAddComment;
