import env from "../config/env.js";

const replaceImgNamesWithUrls = (content) => {
  const modifiedContent = content.replace(
    /<img[^>]*src="([^"]*)"[^>]*>/g,
    (match, imgName) => {
      const imgUrl = `${env.SERVER_HOST}:${env.SERVER_PORT}/${env.API_VERSION}/file/${imgName}`;
      return `<img src="${imgUrl}">`;
    }
  );

  return modifiedContent;
};

export default replaceImgNamesWithUrls;
