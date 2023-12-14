import { config } from "../../utils/constants";

const addUrlToImg = (img) => {
  if (!img) {
    return "";
  }
  if (img.startsWith("https://") || img.startsWith("http://")) {
    img;
  } else {
    img = `${config.SERVER_HOST}/file/${img}`;
  }
  return img;
};

export default addUrlToImg;
