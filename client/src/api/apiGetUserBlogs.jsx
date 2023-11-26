import axios from "axios";
import { config } from "../utils/constants";

const apiGetUserBlogs = async (username) => {
  try {
    const res = await axios
      .get(`${config.SERVER_HOST}/follow-profile/${username}/follower`, {})
      .catch((err) => {
        console.log(err);
      });
    if (!res?.data.success) {
      return null;
    }
    return res.data.data;
  } catch (error) {
    console.log("error:", error);
  }
};

export default apiGetUserBlogs;
