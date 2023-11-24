import axios from "axios";
import { config } from "../utils/constants";
import { toast } from "react-toastify";

const apiUserSearch = async (inputSearch) => {
  if (!inputSearch) return;
  try {
    const response = await axios.post(
      `${config.SERVER_HOST}/user/search`,
      {
        search: inputSearch,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data) return response.data;
  } catch (error) {
    if (error.response.status == 404) {
      toast.error("Users empty!", {
        pauseOnHover: false,
        delay: 500,
      });
    }
  }
};

export default apiUserSearch;
