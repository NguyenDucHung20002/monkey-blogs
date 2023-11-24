import axios from "axios";
import { config } from "../utils/constants";

const apiTopicsSearch = async (inputSearch) => {
  if (!inputSearch) return;
  try {
    const response = await axios.post(
      `${config.SERVER_HOST}/article/topics`,
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
    console.log("error:", error);
  }
};

export default apiTopicsSearch;
