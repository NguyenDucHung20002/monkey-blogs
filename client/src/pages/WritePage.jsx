import { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import styled from "styled-components";
import WriteHeader from "../layout/WriteHeader";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import InputHook from "../components/input/InputHook";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../contexts/auth-context";
import SearchAddTopics from "../components/search/SearchAddTopics";
import { config } from "../utils/constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/button";
import ImageUpload from "../components/image/ImageUpload";
import MyEditor from "../components/input/MyEditor";

const WritePageStyle = styled.div`
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  padding-bottom: 20px;
  .content {
  }
`;

const schema = yup.object({
  title: yup.string().min(4).required("Please fill out your title"),
});

const WritePage = () => {
  const { userInfo } = useAuth();
  const token = localStorage.getItem("token");
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });
  // const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [topics, setTopics] = useState([]);
  const [imageFilename, setImageFilename] = useState(null);
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const arrErrs = Object.values(errors);
    if (arrErrs.length > 0) {
      toast.error(arrErrs[0]?.message, {
        pauseOnHover: false,
        delay: 500,
      });
    }
  }, [errors]);

  useEffect(() => {
    const topicsId = topics.map((topic) => topic._id);
    setValue("topics", topicsId);
  }, [setValue, topics]);

  useEffect(() => {
    setValue("content", content);
  }, [content, setValue]);

  useEffect(() => {
    const contentClone = content;
    const parser = new DOMParser();
    const doc = parser.parseFromString(contentClone, "text/html");
    const textContent = doc.body.textContent;

    setPreview(textContent);
    setValue("preview", preview);
  }, [content, preview, setValue]);

  const handleSelectImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file) {
      const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
      if (!allowedExtensions.exec(file.name)) {
        alert("Choose inly .jpeg .jpg .png .gif");
        e.target.value = "";
        return;
      }
      setImageFilename(file);
      setImage(URL.createObjectURL(file));
    }
  };

  const handleDeleteImage = (e) => {
    e.target.value = "";
    setImage("");
  };

  const handleAddBlog = (values) => {
    if (!isValid) return;
    if (!imageFilename)
      toast.error("Please fill out your image title!", {
        pauseOnHover: false,
        delay: 500,
      });
    const { title, content, topics, preview } = values;
    const cutPreview = preview.slice(0, 200);
    const formData = new FormData();
    formData.set("img", imageFilename);
    formData.set("title", title);
    formData.set("content", content);
    formData.set("preview", cutPreview);
    topics.forEach((value, index) => {
      formData.set(`topics[${index}]`, value);
    });
    async function fetchAddBlog() {
      if (!token) return;
      try {
        const response = await axios.post(
          `${config.SERVER_HOST}:${config.SERVER_PORT}/api/article`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response) {
          navigate("/");
        }
      } catch (error) {
        toast.error(error?.response?.data?.error?.message, {
          pauseOnHover: false,
          delay: 500,
        });
      }
    }
    fetchAddBlog();
  };

  if (!token) return null;

  return (
    <WritePageStyle>
      <form onSubmit={handleSubmit(handleAddBlog)} autoComplete="off">
        <WriteHeader></WriteHeader>
        <div className="mt-5 form-layout">
          <div>
            <ImageUpload
              className="h-[250px]"
              image={image}
              onChange={handleSelectImage}
              handleDeleteImage={handleDeleteImage}
            ></ImageUpload>
            <InputHook
              className="mt-10"
              control={control}
              name="title"
              placeholder="Add title"
            ></InputHook>
          </div>

          <div className="mt-5 topic">
            <h2 className="font-normal text-gray-600 ">
              Publishing to:{" "}
              <span className="font-semibold text-gray-700">
                {userInfo?.data?.username}
              </span>
            </h2>
            <p className="mt-5 text-sm text-gray-600">
              Add or change topics (up to 5) so readers know what your story is
              about
            </p>
            <SearchAddTopics
              topics={topics}
              setTopics={setTopics}
              token={token}
              placeholder="Add a topic"
            ></SearchAddTopics>
            <p className="mt-5 text-sm text-gray-400 ">
              <span className="font-semibold text-gray-600">Note:</span> Changes
              here will affect how your story appears in public places like
              Medium’s homepage and in subscribers’ inboxes — not the contents
              of the story itself.
            </p>
          </div>
        </div>
        <MyEditor content={content} setContent={setContent}></MyEditor>
        <div className="sticky bottom-0 flex justify-center p-4">
          <Button
            type="submit"
            kind="primary"
            height="40px"
            isSubmitting={isSubmitting}
            disabled={isSubmitting}
            className="!font-semibold !text-base !px-5"
          >
            Publish
          </Button>
        </div>
      </form>
    </WritePageStyle>
  );
};

export default WritePage;
