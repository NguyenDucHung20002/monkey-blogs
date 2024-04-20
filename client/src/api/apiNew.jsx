import { config } from "../utils/constants";
import { toast } from "react-toastify";
import { customAxios } from "../config/axios-customize";

const apiGetUserFollow = async (
  token,
  username,
  typeFollow = "followers",
  limit = 15,
  skip = ""
) => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/follow-profile/${username}/${typeFollow}?skip=${skip}&limit=${limit}`,
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
        : "Something went wrong 1",
      {
        pauseOnHover: false,
        delay: 250,
      }
    );
  }
};

// const apiUploadCheckImage = async (token, file) => {
//   try {
//     const bodyFormData = new FormData();
//     bodyFormData.append("avatar", file);

//     const response = await customAxios.post(
//       `${config.SERVER_HOST}/file/avatar`,
//       bodyFormData,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
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

const apiUploadAnImage = async (token, file) => {
  try {
    const bodyFormData = new FormData();
    bodyFormData.append("img", file);

    const response = await customAxios.post(
      `${config.SERVER_HOST}/file/img`,
      bodyFormData,
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

const apiDeleteAnImage = async (token, filename) => {
  try {
    const response = await customAxios.delete(
      `${config.SERVER_HOST}/file/${filename}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
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

const apiCreateADraft = async (token, title, content) => {
  try {
    const response = await customAxios.post(
      `${config.SERVER_HOST}/article/draft/create-draft`,
      { title, content },
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

const apiUpdateADraft = async (token, draftId, title, content) => {
  try {
    const response = await customAxios.patch(
      `${config.SERVER_HOST}/article/draft/update-draft/${draftId}`,
      { title, content },
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
      `${config.SERVER_HOST}/article/draft/delete-draft/${draftId}`,
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

const apiCreateAnArticle = async (token, draftId, data) => {
  try {
    const response = await customAxios.patch(
      `${config.SERVER_HOST}/article/${draftId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // "Content-Type": "multipart/form-data",
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

const apiGetAllDrafts = async (token) => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/article/draft/me`,
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

const apiGetReadingHistory = async (token, limit = 15, skip = "") => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/reading-history/me?skip=${skip}&limit=${limit}`,
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

const apiGetMoreArticlesFromAuthor = async (token, articleId) => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/article/more-articles-from-profile/${articleId} `,
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

const apiClearReadingHistory = async (token) => {
  try {
    const response = await customAxios.delete(
      `${config.SERVER_HOST}/reading-history/me/clear `,
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

const apiClearReadNotifications = async (token) => {
  try {
    const response = await customAxios.delete(
      `${config.SERVER_HOST}/notification/clear `,
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

const apiDeleteAnArticleInReadingHistory = async (token, articleId) => {
  try {
    const response = await customAxios.delete(
      `${config.SERVER_HOST}/reading-history/${articleId} `,
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

const apiGetBlockedProfiles = async (token, limit = 15, skip = "") => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/block/me?skip=${skip}&limit=${limit}`,
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

const apiChangePassword = async (
  token,
  oldPassword,
  newPassword,
  confirmPassword
) => {
  try {
    const response = await customAxios.patch(
      `${config.SERVER_HOST}/user/me/change-password`,
      { oldPassword, newPassword, confirmPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
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
  apiGetUserFollow,
  apiUploadAnImage,
  apiDeleteAnImage,
  apiCreateADraft,
  apiUpdateADraft,
  apiDeleteADraft,
  apiCreateAnArticle,
  // apiUploadCheckImage,
  apiGetAllDrafts,
  apiGetReadingHistory,
  apiClearReadingHistory,
  apiDeleteAnArticleInReadingHistory,
  apiClearReadNotifications,
  apiGetBlockedProfiles,
  apiGetMoreArticlesFromAuthor,
  apiChangePassword,
};
