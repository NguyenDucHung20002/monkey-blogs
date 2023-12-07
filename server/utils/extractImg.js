const extracImg = (content) => {
  const imgsName = (content.match(/<img[^>]*src="([^"]*)"[^>]*>/g) || []).map(
    (imgTag) =>
      imgTag
        .match(/src="([^"]*)"/)[1]
        .split("/")
        .pop()
  );

  return imgsName;
};

const string = `<p>ba con ccc</p><p><img src="http://localhost:8080/api/v1/file/88d5f227da721aa5e57577d7377d4a00125e3538.png"></p><p><img src="http://localhost:8080/api/v1/file/c256de3dcd6287493a414ea8012b9c856ec7e105.png"></p><p>das</p>`;

export default extracImg;
