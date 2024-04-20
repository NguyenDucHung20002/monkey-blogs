import { useState } from "react";
import { apiDeleteAnImage, apiUploadAnImage } from "../api/apiNew";
import { config } from "../utils/constants";

const useUploadImage = () => {
  const token = localStorage.getItem("token");
  const [image, setImage] = useState("");

  const onUploadImage = async (file) => {
    const response = await apiUploadAnImage(token, file);
    if (response?.filename) {
      const filename = response?.filename;
      const url = `${config.SERVER_HOST}/file/${filename}`;
      setImage({ url, filename });
    }
  };

  const onSelectImage = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    if (!allowedExtensions.exec(file.name)) {
      alert("Choose only .jpeg .jpg .png .gif");
      e.target.value = "";
      return;
    }
    onUploadImage(file);
  };

  const onDeleteImage = async (filename) => {
    if (!filename) {
      return;
    }
    apiDeleteAnImage(token, filename);
    setImage("");
  };

  return {
    image,
    setImage,
    onSelectImage,
    onDeleteImage,
  };
};

export default useUploadImage;
