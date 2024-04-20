import { config } from "../utils/constants";
import { toast } from "react-toastify";
import { customAxios } from "../config/axios-customize";

const apiCreateATopic = async (token, name) => {
  try {
    const response = await customAxios.post(
      `${config.SERVER_HOST}/topic`,
      { name },
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

const apiDeleteAnArticle = async (token, articleId) => {
  try {
    const response = await customAxios.delete(
      `${config.SERVER_HOST}/article/${articleId}`,
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

const apiRemoveAnArticle = async (token, articleId) => {
  try {
    const response = await customAxios.delete(
      `${config.SERVER_HOST}/article/remove/${articleId}`,
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

const apiDeleteATopic = async (token, topicId) => {
  try {
    const response = await customAxios.delete(
      `${config.SERVER_HOST}/topic/${topicId}`,
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

const apiFollowATopic = async (token, topicId) => {
  try {
    const response = await customAxios.post(
      `${config.SERVER_HOST}/follow-topic/${topicId}`,
      {},
      {
        headers: {
          authorization: `Bearer ${token}`,
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

const apiUnFollowATopic = async (token, topicId) => {
  try {
    const response = await customAxios.delete(
      `${config.SERVER_HOST}/follow-topic/${topicId}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
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

const apiFollowAUser = async (profileId, token) => {
  try {
    const response = await customAxios.post(
      `${config.SERVER_HOST}/follow-profile/${profileId}`,
      {},
      {
        headers: {
          authorization: `Bearer ${token}`,
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

const apiGetAllUsers = async (token, limit = "10", skip = "", search = "") => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/user?limit=${limit}&skip=${skip}&search=${search}`,
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

const apiGetAllStaffs = async (token, limit = "10", skip = "", search = "") => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/role/staffs?limit=${limit}&skip=${skip}&search=${search}`,
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

const apiGetAnArticle = async (token, articleSlug) => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/article/${articleSlug} `,
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

const apiGetAnArticleDetail = async (token, articleId) => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/article/detail/${articleId} `,
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

const apiGetAnArticleOrADraftToEdit = async (token, id) => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/article/get/${id} `,
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

const apiDeleteADraft = async (token, draftId) => {
  try {
    const response = await customAxios.delete(
      `${config.SERVER_HOST}/article/draft/delete-draft/${draftId} `,
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

// const apiGetArticleSkip = async (skipId, token, limit = 5) => {
//   try {
//     const response = await customAxios.get(
//       `${config.SERVER_HOST}/article?skip=${skipId}&limit=${limit}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     if (response?.data?.success) {
//       return response.data;
//     }
//   } catch (error) {
//     console.log("Error:", error);
//     toast.error(
//       error?.response?.data?.message
//         ? error?.response?.data?.message
//         : "Something went wrong",
//       {
//         pauseOnHover: false,
//         delay: 250,
//       }
//     );
//   }
// };

const apiCreateAComment = async (
  articleId,
  parentCommentId,
  content,
  token
) => {
  try {
    const response = await customAxios.post(
      `${config.SERVER_HOST}/comment/${articleId}`,
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

const apiGetMainCommentsOfAnArticle = async (articleId, token) => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/comment/${articleId} `,
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

const apiGetNestedCommentsOfAComment = async (token, commentId) => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/comment/${commentId}/replies `,
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

const apiGetFollowedTopics = async (token) => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/follow-topic/me`,
      {
        headers: {
          authorization: "Bearer " + token,
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

const apiGetNotifications = async (token) => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/notification/me`,
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

const apiMartAllNotificationsAsRead = async (token) => {
  try {
    const response = await customAxios.patch(
      `${config.SERVER_HOST}/notification/mark-all-as-read`,
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

const apiGetProfile = async (token, username) => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/profile/${username}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response?.data?.success) {
      return;
    }
    return response.data;
  } catch (error) {
    return;
  }
};

const apiGetATopic = async (token, topicSlug) => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/topic/${topicSlug}`,
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

const apiGetAllTopics = async (
  token,
  limit = "10",
  search = "",
  option = "",
  skip = ""
) => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/topic?limit=${limit}&search=${search}&skip=${skip}&option=${option}`,
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

const apiGetProfileArticles = async (token, username) => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/article/${username}/all`,
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

// const apiGetFollowedProfiles = async (token, username, limit = 5) => {
//   try {
//     const response = await customAxios.get(
//       `${config.SERVER_HOST}/follow-profile/${username}/following?limit=${limit}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     if (response?.data?.success) {
//       return response.data;
//     }
//   } catch (error) {
//     console.log("Error:", error);
//     toast.error(
//       error?.response?.data?.message
//         ? error?.response?.data?.message
//         : "Something went wrong",
//       {
//         pauseOnHover: false,
//         delay: 250,
//       }
//     );
//   }
// };

const apiGetFollowedProfilesArticles = async (token, limit = 5, skip = "") => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/article/following?limit=${limit}&skip=${skip}`,
      {
        headers: {
          Authorization: "Bearer " + token,
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

const apiRecommendedTopics = async (token, max = 8) => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/topic/recommended-topics?max=${max}`,
      {
        headers: {
          authorization: "Bearer " + token,
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

const apiWhoToFollow = async (token, max = 5) => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/follow-profile/who-to-follow?max=${max}`,
      {
        headers: {
          authorization: "Bearer " + token,
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

const apiUnFollowAUser = async (profileId, token) => {
  try {
    const response = await customAxios.delete(
      `${config.SERVER_HOST}/follow-profile/${profileId}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
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

const apiUpdateAnArticle = async (token, articleId, data) => {
  try {
    const response = await customAxios.patch(
      `${config.SERVER_HOST}/article/update/${articleId}`,
      data,
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

const apiUpdateATopic = async (token, topicId, name) => {
  try {
    const response = await customAxios.patch(
      `${config.SERVER_HOST}/topic/${topicId}`,
      { name },
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

const apiUpdateUserBan = async (token, userId, banType) => {
  try {
    const response = await customAxios.patch(
      `${config.SERVER_HOST}/user/update-ban/${userId}`,
      { banType },
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

const apiBanAUser = async (token, userId, banType) => {
  try {
    const response = await customAxios.patch(
      `${config.SERVER_HOST}/user/ban/${userId}`,
      { banType },
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

const apiUnBanAUser = async (token, userId) => {
  try {
    const response = await customAxios.patch(
      `${config.SERVER_HOST}/user/unban/${userId}`,
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

const apiUpdateProfile = async (token, formData) => {
  try {
    const response = await customAxios.patch(
      `${config.SERVER_HOST}/profile/me/update`,
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

const apiMuteAUser = async (type = "post", token, profileId) => {
  try {
    const response = await customAxios[type](
      `${config.SERVER_HOST}/mute/${profileId}`,
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

const apiBlockAUser = async (type = "post", token, profileId) => {
  try {
    const response = await customAxios[type](
      `${config.SERVER_HOST}/block/${profileId}`,
      {
        method: type,
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

const apiApproveATopic = async (token, topicId) => {
  try {
    const response = await customAxios.patch(
      `${config.SERVER_HOST}/topic/${topicId}/approve`,
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

const apiRejectATopic = async (token, topicId) => {
  try {
    const response = await customAxios.patch(
      `${config.SERVER_HOST}/topic/${topicId}/reject`,
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

const apiReportAUser = async (token, userId, reason, description) => {
  try {
    const response = await customAxios.post(
      `${config.SERVER_HOST}/report-user/${userId}`,
      { reason, description },
      {
        method: "post",
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

export {
  apiGetAnArticleDetail,
  apiGetAllStaffs,
  apiRejectATopic,
  apiRemoveAnArticle,
  apiGetATopic,
  apiCreateATopic,
  apiCreateAComment,
  apiBanAUser,
  apiDeleteAnArticle,
  apiDeleteATopic,
  apiUnBanAUser,
  apiFollowATopic,
  apiFollowAUser,
  apiGetAllUsers,
  apiGetAnArticle,
  apiGetAnArticleOrADraftToEdit,
  apiDeleteADraft,
  // apiGetArticleSkip,
  apiGetMainCommentsOfAnArticle,
  apiGetNestedCommentsOfAComment,
  apiGetFollowedTopics,
  apiGetNotifications,
  apiMartAllNotificationsAsRead,
  apiGetProfile,
  apiGetAllTopics,
  apiGetProfileArticles,
  // apiGetFollowedProfiles,
  apiGetFollowedProfilesArticles,
  apiRecommendedTopics,
  apiWhoToFollow,
  apiUnFollowAUser,
  apiUpdateAnArticle,
  apiUpdateATopic,
  apiUpdateUserBan,
  apiUnFollowATopic,
  apiUpdateProfile,
  apiApproveATopic,
  apiMuteAUser,
  apiBlockAUser,
  apiReportAUser,
};
