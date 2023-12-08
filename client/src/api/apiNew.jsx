import axios from "axios";
import { config } from "../utils/constants";
import { toast } from "react-toastify";
const token = localStorage.getItem("token");

const apiGetUserFollow = async (username, typeFollow = "followers") => {
  try {
    const res = await fetch(
      `${config.SERVER_HOST}/follow-profile/${username}/${typeFollow}`,
      {
        method: "get",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .catch((err) => {
        console.log(err);
      });
    return res;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiUploadCheckImage = async (file) => {
  try {
    const bodyFormData = new FormData();
    bodyFormData.append("avatar", file);
    const response = await axios({
      method: "post",
      url: `${config.SERVER_HOST}/file/avatar`,
      data: bodyFormData,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.log("error:", error);
  }
};
const apiUploadImage = async (file) => {
  try {
    const bodyFormData = new FormData();
    bodyFormData.append("img", file);
    const response = await axios({
      method: "post",
      url: `${config.SERVER_HOST}/file/img`,
      data: bodyFormData,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiDeleteImage = async (filename) => {
  try {
    const response = await axios({
      method: "delete",
      url: `${config.SERVER_HOST}/file/${filename}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiCreateDarft = async (title, content) => {
  try {
    const response = await axios.post(
      `${config.SERVER_HOST}/article/draft/create-draft`,
      { title, content },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response?.data;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiUpdateDarft = async (id, title, content) => {
  try {
    const response = await axios.patch(
      `${config.SERVER_HOST}/article/draft/update-draft/${id}`,
      { title, content },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response?.data;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiDeleteDarft = async (id) => {
  try {
    const response = await axios({
      method: "delete",
      url: `${config.SERVER_HOST}/article/draft/delete-draft/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiAddBlog = async (aricleId, formData) => {
  try {
    const response = await axios.patch(
      `${config.SERVER_HOST}/article/${aricleId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // "Content-Type": "multipart/form-data",
        },
      }
    );
    return response?.data;
  } catch (error) {
    console.log(error);
  }
};
export {
  apiGetUserFollow,
  apiUploadImage,
  apiDeleteImage,
  apiCreateDarft,
  apiUpdateDarft,
  apiDeleteDarft,
  apiAddBlog,
  apiUploadCheckImage,
};
