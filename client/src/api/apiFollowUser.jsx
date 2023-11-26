import axios from "axios";
import { config } from "../utils/constants";
import { toast } from "react-toastify";

const apiFollowUser = async (username, token) => {
  const res = await axios
    .post(
      `${config.SERVER_HOST}/follow-profile/${username}`,
      {},
      {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
    .catch((err) => {
      if (err.response.status == 404) {
        toast.error("Can not find user!", {
          pauseOnHover: false,
          delay: 500,
        });
      } else {
        toast.error("User banned!", {
          pauseOnHover: false,
          delay: 500,
        });
      }
    });
  if (res.data.success) {
    return true;
  }

  return false;
};

export default apiFollowUser;
