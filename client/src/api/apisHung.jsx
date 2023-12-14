import axios from "axios";
import { config } from "../utils/constants";
import { toast } from "react-toastify";

const apiGetPendingReportUsers = async (token) => {
  if (!token) return null;
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/report-user/pending`,
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
  if (!inputSearch) return null;
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
  if (!inputSearch) return null;
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
  if (!inputSearch) return null;
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

const apiGetReadingList = async (token, limit) => {
  if (!token) return null;
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/reading-list/me?limit=${limit}`,
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

const apiAddReadingList = async (token, postId) => {
  if (!token) return null;
  try {
    const response = await axios.post(
      `${config.SERVER_HOST}/reading-list/${postId}`,
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

const apiDeleteReadingList = async (token, postId) => {
  if (!token) return null;
  try {
    const response = await axios.delete(
      `${config.SERVER_HOST}/reading-list/${postId}`,
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

const apiReportBlog = async (token, postId, reason) => {
  console.log("postId, reason:", postId, reason);
  if (!token) return null;
  try {
    const response = await axios.post(
      `${config.SERVER_HOST}/report-article/${postId}`,
      {
        reason,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("response:", response);
    if (response?.data) return response.data;
  } catch (error) {
    toast.warning(error.response.data.message, {
      pauseOnHover: false,
      delay: 200,
    });
  }
};

const apiGetExploreBlogs = async (token, limit, skip = "") => {
  if (!token) return null;
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/article/explore-new-articles/?limit=${limit}&skip=${skip}`,
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

const apiGetStaffPick = async (token, limit = 3, skip = "") => {
  if (!token) return null;
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/article/admin-pick-full-list?limit=${limit}&skip=${skip}`,
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

const apiGetFollowedArticles = async (token, slug, limit = 10, skip = "") => {
  if (!token) return null;
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/article/topic/${slug}?limit=${limit}&skip=${skip}`,
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

const apiGetMyUserFollowings = async (
  token,
  username,
  limit = 10,
  skip = ""
) => {
  if (!token) return null;
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/follow-profile/${username}/following?limit=${limit}&skip=${skip}`,
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

const apiGetPendingReportsArticles = async (token) => {
  if (!token) return null;
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/report-article/pending`,
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

const apiGetAllArticlesAdmin = async (
  token,
  limit,
  search = "",
  status = "",
  skip = ""
) => {
  if (!token) return null;
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/article?limit=${limit}&skip=${skip}&search=${search}&option=${status}`,
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
const apiGetMyMuted = async (token) => {
  if (!token) return null;
  try {
    const response = await axios.get(`${config.SERVER_HOST}/mute/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response?.data) return response.data;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiLikeArticle = async (token, blogId) => {
  if (!token && !blogId) return null;
  try {
    const response = await axios.post(
      `${config.SERVER_HOST}/like/${blogId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data.success) return true;
    return false;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiUnLikeArticle = async (token, blogId) => {
  if (!token && !blogId) return null;
  try {
    const response = await axios.delete(
      `${config.SERVER_HOST}/like/${blogId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) return true;
    return false;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiGetPendingReasonsReportsArticles = async (token, blogId) => {
  if (!token && !blogId) return null;
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/report-article/${blogId}/pending`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) return response?.data;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiMarkReportBlog = async (token, reportBlogId) => {
  console.log("reportBlogId:", reportBlogId);
  if (!token && !reportBlogId) return null;
  try {
    const response = await axios.patch(
      `${config.SERVER_HOST}/report-article/report/${reportBlogId}/resolve`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) return true;
    return false;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiMarkAllReportBlog = async (token, BlogId) => {
  if (!token && !BlogId) return null;
  try {
    const response = await axios.patch(
      `${config.SERVER_HOST}/report-article/${BlogId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) return true;
    return false;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiSetBackToDraft = async (token, BlogId) => {
  if (!token && !BlogId) return null;
  try {
    const response = await axios.patch(
      `${config.SERVER_HOST}/article/set-article-back-to-draft/${BlogId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) return true;
    return false;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiGetReportsBlogSolved = async (token) => {
  if (!token) return null;
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/report-article/resolved`,
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

const apiGetBlogsTopic = async (token, slug) => {
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/article/topic/${slug}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.success) return response.data;
  } catch (error) {
    console.log("error:", error);
  }
};

export {
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
  apiGetFollowedArticles,
  apiGetMyUserFollowings,
};
