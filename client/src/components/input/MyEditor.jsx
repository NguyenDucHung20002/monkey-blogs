/* eslint-disable react/prop-types */
import axios from "axios";
import { debounce } from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactQuill from "react-quill";
import { imgbbAPI } from "../../config/apiConfig";

const MyEditor = ({ content, setContent }) => {
  const [imageFiles, setImageFiles] = useState([]);
  const quillRef = useRef();

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.setAttribute("multiple", "");
    input.click();

    input.addEventListener("change", async () => {
      const files = [...input.files];
      const file = files[0];
      const formData = new FormData();

      formData.append("image", file);

      const res = await axios({
        method: "post",
        url: imgbbAPI,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data.data.url) {
        const src = res.data.data.url;
        const date = Date.now();
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection();
        editor.insertEmbed(range.index, "image", src);
        setImageFiles((prev) => [...prev, { path: src, id: date }]);
      }
    });
  };

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
          console.log("tempImageFiles:", tempImageFiles);
          const filteredImageFiles = tempImageFiles.filter(
            (image) => image.id !== imageFiles[index].id
          );
          deleteImage(imageFiles[index].id);
          console.log("filteredImageFiles:", filteredImageFiles);

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
        handlers: { image: imageHandler },
      },
    }),
    []
  );

  const handleChangeContent = debounce((value) => {
    setContent(value);
  }, 200);

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
