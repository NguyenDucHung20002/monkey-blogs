/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import { imgbbAPI } from "../../config/apiConfig";
import ImageUploader from "quill-image-uploader";
Quill.register("modules/imageUploader", ImageUploader);

const MyEditor = ({ content, setContent }) => {
  const [imageFiles, setImageFiles] = useState([]);
  const quillRef = useRef();

  const deleteImage = (id) => {
    console.log("id:", id);
  };

  useEffect(() => {
    if (
      quillRef.current?.lastDeltaChangeSet?.ops[1]?.delete === 1 &&
      imageFiles.length > 0
    ) {
      for (let index = 0; index < imageFiles.length; index++) {
        if (!quillRef.current?.value.includes(imageFiles[index].path)) {
          const tempImageFiles = structuredClone(imageFiles);
          // console.log("tempImageFiles:", tempImageFiles);
          const filteredImageFiles = tempImageFiles.filter(
            (image) => image.id !== imageFiles[index].id
          );
          deleteImage(imageFiles[index].id);
          // console.log("filteredImageFiles:", filteredImageFiles);

          setImageFiles(filteredImageFiles);
        }
      }
    }
  }, [quillRef.current?.lastDeltaChangeSet?.ops[1]?.delete]);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          ["bold", "italic", "underline", "strike"],
          ["blockquote"],
          [{ header: 1 }, { header: 2 }], // custom button values
          [{ list: "ordered" }, { list: "bullet" }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["link", "image"],
        ],
      },
      imageUploader: {
        upload: async (file) => {
          const bodyFormData = new FormData();
          bodyFormData.append("image", file);
          const response = await axios({
            method: "post",
            url: imgbbAPI,
            data: bodyFormData,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          if (response.data.data.url) {
            const src = response.data.data.url;
            const date = Date.now();
            setImageFiles((prev) => [...prev, { path: src, id: date }]);
          }
          return response.data.data.url;
        },
      },
    }),
    []
  );

  const handleChangeContent = (value) => {
    setContent(value);
  };

  return (
    <div className="content entry-content">
      <ReactQuill
        ref={quillRef}
        modules={modules}
        theme="snow"
        value={content}
        onChange={handleChangeContent}
      />
    </div>
  );
};

export default MyEditor;
