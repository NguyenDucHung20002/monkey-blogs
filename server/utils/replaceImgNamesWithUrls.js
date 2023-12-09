const replaceImgNamesWithUrls = (content) => {
  const modifiedContent = content.replace(
    /<img[^>]*src="([^"]*)"[^>]*>/g,
    (match, imgName) => {
      const imgUrl = `/path/to/images/${imgName}`;
      return `<img src="${imgUrl}">`;
    }
  );

  return modifiedContent;
};

export default replaceImgNamesWithUrls;
