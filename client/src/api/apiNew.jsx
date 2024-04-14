import { config } from "../utils/constants";
import { toast } from "react-toastify";
import { customAxios } from "../config/axios-customize";

const token = localStorage.getItem("token");

const apiGetUserFollow = async (username, typeFollow = "followers") => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/follow-profile/${username}/${typeFollow}`,
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

const apiUploadCheckImage = async (file) => {
  try {
    const bodyFormData = new FormData();
    bodyFormData.append("avatar", file);

    const response = await customAxios.post(
      `${config.SERVER_HOST}/file/avatar`,
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

const apiUploadImage = async (file) => {
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

const apiDeleteImage = async (filename) => {
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

const apiCreateDraft = async (title, content) => {
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

const apiUpdateDraft = async (id, title, content) => {
  try {
    const response = await customAxios.patch(
      `${config.SERVER_HOST}/article/draft/update-draft/${id}`,
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

const apiDeleteDraft = async (id) => {
  try {
    const response = await customAxios.delete(
      `${config.SERVER_HOST}/article/draft/delete-draft/${id}`,
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

const apiAddBlog = async (articleId, data) => {
  try {
    const response = await customAxios.patch(
      `${config.SERVER_HOST}/article/${articleId}`,
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

const apiGetMyDraft = async () => {
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

const apiGetReadingHistory = async () => {
  try {
    const response = await customAxios.get(
      `${config.SERVER_HOST}/reading-history/me `,
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

const apiGetMoreArticleInDetailPage = async (articleId) => {
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

const apiDeleteReadingHistory = async () => {
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

const apiDeleteAllNotification = async () => {
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

const apiDeleteArticleHistory = async (id) => {
  try {
    const response = await customAxios.delete(
      `${config.SERVER_HOST}/reading-history/${id} `,
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

const apiGetMyBlocked = async () => {
  try {
    const response = await customAxios.get(`${config.SERVER_HOST}/block/me`, {
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

const apiChangePassword = async (oldPassword, newPassword, confirmPassword) => {
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
  apiUploadImage,
  apiDeleteImage,
  apiCreateDraft,
  apiUpdateDraft,
  apiDeleteDraft,
  apiAddBlog,
  apiUploadCheckImage,
  apiGetMyDraft,
  apiGetReadingHistory,
  apiDeleteReadingHistory,
  apiDeleteArticleHistory,
  apiDeleteAllNotification,
  apiGetMyBlocked,
  apiGetMoreArticleInDetailPage,
  apiChangePassword,
};
