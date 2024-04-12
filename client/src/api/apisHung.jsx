import { config } from "../utils/constants";
import { toast } from "react-toastify";
import { customAxios } from "../config/axios-customize";
import axios from "axios";

const apiGetPendingReportUsers = async (
  token,
  limit = 10,
  skipId = "",
  skipCount = ""
) => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/report-user/user/pending?limit=${limit}&skipId=${skipId}&skipCount=${skipCount}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

const apiGetPendingReportStaff = async (
  token,
  limit = 10,
  skipId = "",
  skipCount = ""
) => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/report-user/staff/pending?limit=${limit}&skipId=${skipId}&skipCount=${skipCount}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

const apiGetReportedUsers = async (token, userId, limit = 10, skip = "") => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/report-user/${userId}/pending?limit=${limit}&skip =${skip}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

const apiGetUsersResolved = async (token, limit = 10, skip = "") => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/report-user/resolved?limit=${limit}&skip =${skip}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

const apiResolveReportedUsers = async (token, userId) => {
  try {
    const response = await customAxios.patch(
      `${config.SERVER_HOST}/report-user/report/${userId}/resolve`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

const apiResolveReportedAllUsers = async (token, userId) => {
  try {
    const response = await customAxios.patch(
      `${config.SERVER_HOST}/report-user/${userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

const apiDeleteMyComment = async (token, commentId) => {
  try {
    const response = await customAxios.delete(
      `${config.SERVER_HOST}/comment/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

const apiUserSearch = async (token, inputSearch, limit = 10, skip = "") => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/search?users=${inputSearch}&limit=${limit}&skip =${skip}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

const apiBlogSearch = async (token, inputSearch, limit = 10, skip = "") => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/search?post=${inputSearch}&limit=${limit}&skip=${skip}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

const apiTopicsSearch = async (
  token,
  inputSearch = "",
  limit = 10,
  skip = ""
) => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/search?tag=${inputSearch}&limit=${limit}&skip =${skip}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

const apiGetReadingList = async (token, limit) => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/reading-list/me?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

const apiAddReadingList = async (token, postId) => {
  try {
    const response = await customAxios.post(
      `${config.SERVER_HOST}/reading-list/${postId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

const apiDeleteReadingList = async (token, postId) => {
  try {
    const response = await customAxios.delete(
      `${config.SERVER_HOST}/reading-list/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

const apiReportBlog = async (token, postId, reason) => {
  try {
    const response = await customAxios.post(
      `${config.SERVER_HOST}/report-article/${postId}`,
      { reason },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

const apiGetExploreBlogs = async (token, limit, skip = "") => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/article/explore-new-articles/?limit=${limit}&skip=${skip}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

const apiGetStaffPick = async (token, limit = 3, skip = "") => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/article/admin-pick-full-list?limit=${limit}&skip=${skip}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

const apiGetFollowedTopicArticles = async (
  token,
  slug,
  limit = 10,
  skip = ""
) => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/article/followed/topic/${slug}?limit=${limit}&skip=${skip}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

const apiGetMyUserFollowings = async (
  token,
  username,
  limit = 10,
  skip = ""
) => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/follow-profile/${username}/following?limit=${limit}&skip=${skip}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

const apiGetPendingReportsArticles = async (token) => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/report-article/pending`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

const apiGetAllArticlesAdmin = async (
  token,
  limit,
  search = "",
  status = "",
  skip = ""
) => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/article?limit=${limit}&skip=${skip}&search=${search}&option=${status}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

const apiGetMyMuted = async (token) => {
  try {
    const response = await customAxios.get(`${config.SERVER_HOST}/mute/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

const apiLikeArticle = async (token, blogId) => {
  try {
    const response = await customAxios.post(
      `${config.SERVER_HOST}/like/${blogId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

const apiUnLikeArticle = async (token, blogId) => {
  try {
    const response = await customAxios.delete(
      `${config.SERVER_HOST}/like/${blogId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

const apiGetPendingReasonsReportsArticles = async (token, blogId) => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/report-article/${blogId}/pending`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

const apiMarkReportBlog = async (token, reportBlogId) => {
  try {
    const response = await customAxios.patch(
      `${config.SERVER_HOST}/report-article/report/${reportBlogId}/resolve`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

const apiMarkAllReportBlog = async (token, BlogId) => {
  try {
    const response = await customAxios.patch(
      `${config.SERVER_HOST}/report-article/${BlogId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

const apiSetBackToDraft = async (token, BlogId, reason) => {
  try {
    const response = await customAxios.patch(
      `${config.SERVER_HOST}/article/set-article-back-to-draft/${BlogId}`,
      { reason },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      return reason.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

const apiGetReportsBlogSolved = async (token) => {
  if (!token) {
    return null;
  }
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/report-article/resolved`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

const apiGetBlogsTopic = async (token, slug, limit = 9, skip = "") => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/article/topic/${slug}?limit=${limit}&skip=${skip}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

const apiSetApproved = async (token, BlogId) => {
  try {
    const response = await customAxios.patch(
      `${config.SERVER_HOST}/article/approve/${BlogId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

const apiGetRemovedArticles = async (token, limit = 9, skip = "") => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/article/removed-articles?limit=${limit}&skip=${skip}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

const apiRestoreArticle = async (token, BlogId) => {
  try {
    const response = await customAxios.patch(
      `${config.SERVER_HOST}/article/restore/${BlogId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

const apiGetUserLikedBlogs = async (token, blogId, limit = 2, skip = "") => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/like/${blogId}?limit=${limit}&skip=${skip}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

const apiSetStaff = async (token, userId) => {
  try {
    const response = await customAxios.patch(
      `${config.SERVER_HOST}/role/make-staff/${userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

const apiSetUser = async (token, userId) => {
  try {
    const response = await customAxios.patch(
      `${config.SERVER_HOST}/role/make-user/${userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

const apiRegister = async (email, password) => {
  try {
    const response = await axios.post(
      `${config.SERVER_HOST}/auth/register`,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

const apiLogin = async (email, password) => {
  try {
    const response = await axios.post(
      `${config.SERVER_HOST}/auth/login-email`,
      { email, password },
      { withCredentials: true },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

const apiVerifyEmail = async (token) => {
  try {
    const response = await customAxios.patch(
      `${config.SERVER_HOST}/auth/verify-email`,
      { token },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

const apiVerifySetupPassword = async (token) => {
  try {
    const response = await axios.patch(
      `${config.SERVER_HOST}/auth/verify-setup-password`,
      { token },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

const apiVerifyProfile = async (token, formData) => {
  try {
    const response = await customAxios.post(
      `${config.SERVER_HOST}/profile/setup-profile`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

const apiForgotPassword = async (email) => {
  try {
    const response = await axios.post(
      `${config.SERVER_HOST}/auth/forgot-password`,
      { email },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

const apiChangeForgotPassword = async (
  token,
  newPassword = "",
  confirmPassword = ""
) => {
  try {
    const response = await customAxios.patch(
      `${config.SERVER_HOST}/auth/reset-password/${token}`,
      { newPassword, confirmPassword },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

export {
  apiGetPendingReportStaff,
  apiVerifySetupPassword,
  apiChangeForgotPassword,
  apiForgotPassword,
  apiVerifyProfile,
  apiVerifyEmail,
  apiLogin,
  apiRegister,
  apiSetUser,
  apiSetStaff,
  apiGetUserLikedBlogs,
  apiRestoreArticle,
  apiGetRemovedArticles,
  apiSetApproved,
  apiGetBlogsTopic,
  apiGetReportsBlogSolved,
  apiSetBackToDraft,
  apiMarkAllReportBlog,
  apiMarkReportBlog,
  apiGetPendingReasonsReportsArticles,
  apiUnLikeArticle,
  apiLikeArticle,
  apiGetMyMuted,
  apiGetAllArticlesAdmin,
  apiGetPendingReportsArticles,
  apiGetPendingReportUsers,
  apiGetReportedUsers,
  apiResolveReportedUsers,
  apiResolveReportedAllUsers,
  apiGetUsersResolved,
  apiDeleteMyComment,
  apiUserSearch,
  apiTopicsSearch,
  apiBlogSearch,
  apiGetReadingList,
  apiAddReadingList,
  apiDeleteReadingList,
  apiReportBlog,
  apiGetExploreBlogs,
  apiGetStaffPick,
  apiGetFollowedTopicArticles,
  apiGetMyUserFollowings,
};
