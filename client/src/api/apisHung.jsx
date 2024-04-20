import { config } from "../utils/constants";
import { toast } from "react-toastify";
import { customAxios } from "../config/axios-customize";
import axios from "axios";

const apiGetPendingReportedUsers = async (
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

const apiGetPendingReportedStaffs = async (
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

const apiGetPendingReportsOfAUser = async (
  token,
  userId,
  limit = 10,
  skip = ""
) => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/report-user/${userId}/pending?limit=${limit}&skip=${skip}`,
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

const apiGetResolvedUserReports = async (token, limit = 10, skip = "") => {
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

const apiMarkAReportOfAUserAsResolved = async (token, reportUserId) => {
  try {
    const response = await customAxios.patch(
      `${config.SERVER_HOST}/report-user/report/${reportUserId}/resolve`,
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

const apiMarkAllReportsOfAUserAsResolved = async (token, userId) => {
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

const apiDeleteAComment = async (token, commentId) => {
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

const apiUsersSearch = async (token, search, limit = 10, skip = "") => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/search?users=${search}&limit=${limit}&skip =${skip}`,
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
    // toast.error(
    //   error?.response?.data?.message
    //     ? error?.response?.data?.message
    //     : "Something went wrong",
    //   {
    //     pauseOnHover: false,
    //     delay: 250,
    //   }
    // );
  }
};

const apiArticlesSearch = async (token, search, limit = 10, skip = "") => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/search?post=${search}&limit=${limit}&skip=${skip}`,
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
    // toast.error(
    //   error?.response?.data?.message
    //     ? error?.response?.data?.message
    //     : "Something went wrong",
    //   {
    //     pauseOnHover: false,
    //     delay: 250,
    //   }
    // );
  }
};

const apiTopicsSearch = async (token, search = "", limit = 10, skip = "") => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/search?tag=${search}&limit=${limit}&skip =${skip}`,
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
    // toast.error(
    //   error?.response?.data?.message
    //     ? error?.response?.data?.message
    //     : "Something went wrong",
    //   {
    //     pauseOnHover: false,
    //     delay: 250,
    //   }
    // );
  }
};

const apiGetReadingList = async (token, limit = 15, skip = "") => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/reading-list/me?skip=${skip}&limit=${limit}`,
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
    // toast.error(
    //   error?.response?.data?.message
    //     ? error?.response?.data?.message
    //     : "Something went wrong",
    //   {
    //     pauseOnHover: false,
    //     delay: 250,
    //   }
    // );
  }
};

const apAddAnArticleToReadingList = async (token, articleId) => {
  try {
    const response = await customAxios.post(
      `${config.SERVER_HOST}/reading-list/${articleId}`,
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

const apiRemoveAnArticleInReadingList = async (token, articleId) => {
  try {
    const response = await customAxios.delete(
      `${config.SERVER_HOST}/reading-list/${articleId}`,
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

const apiReportAnArticle = async (token, articleId, reason) => {
  try {
    const response = await customAxios.post(
      `${config.SERVER_HOST}/report-article/${articleId}`,
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

const apiExploreNewArticles = async (token, limit, skip = "") => {
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
    // toast.error(
    //   error?.response?.data?.message
    //     ? error?.response?.data?.message
    //     : "Something went wrong",
    //   {
    //     pauseOnHover: false,
    //     delay: 250,
    //   }
    // );
  }
};

const apiAdminPick = async (token, limit = 3, skip = "") => {
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
    // toast.error(
    //   error?.response?.data?.message
    //     ? error?.response?.data?.message
    //     : "Something went wrong",
    //   {
    //     pauseOnHover: false,
    //     delay: 250,
    //   }
    // );
  }
};

const apiGetFollowedTopicArticles = async (
  token,
  topicSlug,
  limit = 10,
  skip = ""
) => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/article/followed/topic/${topicSlug}?limit=${limit}&skip=${skip}`,
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

const apiGetFollowedProfiles = async (
  token,
  username,
  limit = 15,
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

const apiGetPendingReportedArticles = async (
  token,
  limit = 15,
  skipId = "",
  skipCount = ""
) => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/report-article/pending?skipId=${skipId}&skipCount=${skipCount}&limit=${limit}`,
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

const apiGetAllArticles = async (
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

const apiGetMutedProfiles = async (token, limit, skip = "") => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/mute/me?skip=${skip}&limit=${limit}`,
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

const apiLikeAnArticle = async (token, articleId) => {
  try {
    const response = await customAxios.post(
      `${config.SERVER_HOST}/like/${articleId}`,
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

const apiUnLikeAnArticle = async (token, articleId) => {
  try {
    const response = await customAxios.delete(
      `${config.SERVER_HOST}/like/${articleId}`,
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

const apiGetPendingReportsOfAnArticle = async (
  token,
  articleId,
  limit = 15,
  skip = ""
) => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/report-article/${articleId}/pending?skip=${skip}&limit=${limit}`,
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

const apiMarkAReportOfAnArticleAsResolved = async (token, reportArticleId) => {
  try {
    const response = await customAxios.patch(
      `${config.SERVER_HOST}/report-article/report/${reportArticleId}/resolve`,
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

const apiMarkAllReportsOfAnArticleAsResolved = async (token, articleId) => {
  try {
    const response = await customAxios.patch(
      `${config.SERVER_HOST}/report-article/${articleId}`,
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

const apiSetAnArticleBackToDraft = async (token, articleId, reason) => {
  try {
    const response = await customAxios.patch(
      `${config.SERVER_HOST}/article/set-article-back-to-draft/${articleId}`,
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

const apiGetResolvedArticleReports = async (token) => {
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

const apiGetTopicArticles = async (token, topicSlug, limit = 9, skip = "") => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/article/topic/${topicSlug}?limit=${limit}&skip=${skip}`,
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
    // toast.error(
    //   error?.response?.data?.message
    //     ? error?.response?.data?.message
    //     : "Something went wrong",
    //   {
    //     pauseOnHover: false,
    //     delay: 250,
    //   }
    // );
  }
};

const approveAnArticle = async (token, articleId) => {
  try {
    const response = await customAxios.patch(
      `${config.SERVER_HOST}/article/approve/${articleId}`,
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

const apiRestoreAnArticle = async (token, articleId) => {
  try {
    const response = await customAxios.patch(
      `${config.SERVER_HOST}/article/restore/${articleId}`,
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

const apiGetLikersOfAnArticle = async (
  token,
  articleId,
  limit = 2,
  skip = ""
) => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/like/${articleId}?limit=${limit}&skip=${skip}`,
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

const apiMakeAUserStaff = async (token, userId) => {
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

const apiMakeAStaffUser = async (token, userId) => {
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
    // toast.error(
    //   error?.response?.data?.message
    //     ? error?.response?.data?.message
    //     : "Something went wrong",
    //   {
    //     pauseOnHover: false,
    //     delay: 250,
    //   }
    // );
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
    // toast.error(
    //   error?.response?.data?.message
    //     ? error?.response?.data?.message
    //     : "Something went wrong",
    //   {
    //     pauseOnHover: false,
    //     delay: 250,
    //   }
    // );
  }
};

const apiVerifySetupProfile = async (token, formData) => {
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

const apiResetPassword = async (
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
  apiGetPendingReportedStaffs,
  apiVerifySetupPassword,
  apiResetPassword,
  apiForgotPassword,
  apiVerifySetupProfile,
  apiVerifyEmail,
  apiLogin,
  apiRegister,
  apiMakeAStaffUser,
  apiMakeAUserStaff,
  apiGetLikersOfAnArticle,
  apiRestoreAnArticle,
  apiGetRemovedArticles,
  approveAnArticle,
  apiGetTopicArticles,
  apiGetResolvedArticleReports,
  apiSetAnArticleBackToDraft,
  apiMarkAllReportsOfAnArticleAsResolved,
  apiMarkAReportOfAnArticleAsResolved,
  apiGetPendingReportsOfAnArticle,
  apiUnLikeAnArticle,
  apiLikeAnArticle,
  apiGetMutedProfiles,
  apiGetAllArticles,
  apiGetPendingReportedArticles,
  apiGetPendingReportedUsers,
  apiGetPendingReportsOfAUser,
  apiMarkAReportOfAUserAsResolved,
  apiMarkAllReportsOfAUserAsResolved,
  apiGetResolvedUserReports,
  apiDeleteAComment,
  apiUsersSearch,
  apiTopicsSearch,
  apiArticlesSearch,
  apiGetReadingList,
  apAddAnArticleToReadingList,
  apiRemoveAnArticleInReadingList,
  apiReportAnArticle,
  apiExploreNewArticles,
  apiAdminPick,
  apiGetFollowedTopicArticles,
  apiGetFollowedProfiles,
};
