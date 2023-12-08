import { useCallback, useEffect, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import styled from "styled-components";
import WriteHeader from "../layout/WriteHeader";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useWatch } from "react-hook-form";
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
import {
  apiAddBlog,
  apiCreateDarft,
  apiDeleteDarft,
  apiUpdateDarft,
} from "../api/apiNew";
import { debounce } from "lodash";
import useUploadImage from "../hooks/useUploadImage";

const WritePageStyle = styled.div`
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  padding-bottom: 20px;
  .content {
  }
`;

const schema = yup.object({
  title: yup.string().required("Please fill out your title").min(4),
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
  // const [image, setImage] = useState("");
  const [topics, setTopics] = useState([]);
  const [imageFilename, setImageFilename] = useState(null);
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [newDraft, setNewDraft] = useState({});
  const [hasRunOnce, setHasRunOnce] = useState(false);
  const navigate = useNavigate();
  const { image, onSelectImage, onDeleteImage } = useUploadImage();
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
    if (image) return;
    onSelectImage(e);
  };

  const handleDeleteImage = (e) => {
    onDeleteImage(image?.filename);
  };

  const handleAddBlog = (values) => {
    if (!isValid) return;
    if (!image) {
      toast.error("Please fill out your image title!", {
        pauseOnHover: false,
        delay: 500,
      });
      return;
    }
    const { title, content, preview } = values;
    const topicNames = topics.map((val, i) => val.name);
    console.log(topicNames);
    const idDraft = newDraft?.draftId;
    const data = {
      topicNames,
      preview,
      banner: image.filename,
    };
    console.log(data);
    // const cutPreview = preview.slice(0, 200);
    // const formData = new FormData();
    // formData.set("banner", imageFilename);
    // formData.set("title", title);
    // formData.set("content", content);
    // formData.set("preview", cutPreview);
    // topics.forEach((value, index) => {
    //   formData.set(`topicNames[${index}]`, value?.name);
    // });
    async function fetchAddBlog() {
      if (!token) return;
      const response = await apiAddBlog(idDraft, data);
      if (response.success) {
        navigate("/");
      }
    }
    fetchAddBlog();
  };
  const handleClickPublish = () => {
    handleSubmit(handleAddBlog)();
  };

  const watchedTitle = useWatch({ control, name: "title", defaultValue: "" });
  const createDraft = async () => {
    const res = await apiCreateDarft(watchedTitle, content);
    if (res?.success) {
      setNewDraft(res);
      setIsSaved(true);
      setHasRunOnce(true);
    }
  };
  const UpdateDraft = debounce(async () => {
    const idDraft = newDraft?.draftId;
    const res = await apiUpdateDarft(idDraft, watchedTitle, content);
    if (res?.success) {
      setIsSaved(true);
    }
  }, 1000);

  useEffect(() => {
    // console.log("title",watchedTitle);
    // console.log("content",content);
    const check = content !== "" && watchedTitle !== "";
    setIsSaved(false);
    if (check && !hasRunOnce) {
      createDraft();
    }
    if (newDraft?.draftId) {
      UpdateDraft();
    }
    // console.log("newDraft",newDraft);
    // console.log("changeDraft",changeDraft);
  }, [watchedTitle, content]);

  if (!token) return null;
  return (
    <WritePageStyle>
      <form onSubmit={handleSubmit(handleAddBlog)} autoComplete="off">
        <WriteHeader
          isSaved={isSaved}
          image={image?.url}
          handleSelectImage={handleSelectImage}
          topics={topics}
          setTopics={setTopics}
          token={token}
          isSubmitting={isSubmitting}
          handleDeleteImage={handleDeleteImage}
          handleClickPublish={handleClickPublish}
        ></WriteHeader>
        <InputHook
          className=""
          control={control}
          name="title"
          placeholder="Add title"
        ></InputHook>
        <MyEditor content={content} setContent={setContent}></MyEditor>
      </form>
    </WritePageStyle>
  );
};

export default WritePage;
