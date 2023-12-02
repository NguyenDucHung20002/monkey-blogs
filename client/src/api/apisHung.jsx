import axios from "axios";
import { config } from "../utils/constants";
import { toast } from "react-toastify";

const apiGetPendingReportUsers = async (token, limit = 10, skipCount) => {
  if (!token) return null;
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/report-user/pending?limit=${limit}&skipCount=${skipCount}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response?.data) return response.data;
  } catch (error) {
    if (error.response.status == 404) {
      toast.error("Users empty!", {
        pauseOnHover: true,
        delay: 300,
      });
    }
  }
};

const apiGetReportedUsers = async (token, userId, limit = 10, skip) => {
  if (!token && !userId) return null;
  if (!skip) skip = "";
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/report-user/${userId}/pending?limit=${limit}&skip=${skip}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response?.data) return response.data;
  } catch (error) {
    if (error.response.status == 404) {
      toast.error("Users empty!", {
        pauseOnHover: true,
        delay: 300,
      });
    }
  }
};

const apiGetUsersResolved = async (token, limit = 10, skip) => {
  if (!token) return null;
  if (!skip) skip = "";
  console.log("skip:", skip);
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/report-user/resolved?limit=${limit}&skip=${skip}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response?.data) return response.data;
  } catch (error) {
    if (error.response.status == 404) {
      toast.error("Users empty!", {
        pauseOnHover: true,
        delay: 300,
      });
    }
  }
};

const apiResolveReportedUsers = async (token, userId) => {
  if (!token && !userId) return null;
  try {
    const response = await axios.patch(
      `${config.SERVER_HOST}/report-user/report/${userId}/resolve`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response?.data) return response.data;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiResolveReportedAllUsers = async (token, userId) => {
  if (!token && !userId) return null;
  try {
    const response = await axios.patch(
      `${config.SERVER_HOST}/report-user/${userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response?.data) return response.data;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiDeleteMyComment = async (token, commentId) => {
  if (!commentId && !token) return null;
  try {
    const response = await axios.delete(
      `${config.SERVER_HOST}/comment/${commentId}`,
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

const apiUserSearch = async (token, inputSearch, limit = 10, skip) => {
  if (!inputSearch) return;
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/search?users=${inputSearch}&limit=${limit}&skip=${skip}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data) return response.data;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiBlogSearch = async (token, inputSearch, limit = 10, skip = "") => {
  if (!inputSearch) return;
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/search?post=${inputSearch}&limit=${limit}&skip=${skip}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data) return response.data;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiTopicsSearch = async (token, inputSearch = "", limit = 10, skip) => {
  if (!inputSearch) return;
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/search?tag=${inputSearch}&limit=${limit}&skip=${skip}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data) return response.data;
  } catch (error) {
    console.log("error:", error);
  }
};

export {
  apiGetPendingReportUsers,
  apiGetReportedUsers,
  apiResolveReportedUsers,
  apiResolveReportedAllUsers,
  apiGetUsersResolved,
  apiDeleteMyComment,
  apiUserSearch,
  apiTopicsSearch,
  apiBlogSearch,
};
