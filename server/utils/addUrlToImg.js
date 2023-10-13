const { env } = require("../config/env");

const addUrlToImg = (img) => {
  if (!img) {
    return "";
  }
  if (img.startsWith("https://") || img.startsWith("http://")) {
    img;
  } else {
    img = `${env.SERVER_HOST}:${env.SERVER_PORT}/api/file/${img}`;
  }
  return img;
};

module.exports = addUrlToImg;
