import { useEffect, useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/button";
import ImageUpload from "../components/image/ImageUpload";
import MyEditor from "../components/input/MyEditor";
import {
  apiGetArticle,
  apiGetArticleOrDraft,
  apiUpdateArticle,
} from "../api/api";
import useUploadImage from "../hooks/useUploadImage";
import { config } from "../utils/constants";
import { apiUpdateDarft } from "../api/apiNew";
import { debounce } from "lodash";

const EditBlogPageStyle = styled.div`
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  padding-bottom: 20px;
  .content {
  }
`;

const schema = yup.object({
  title: yup.string().required("Please fill out your title"),
});

const EditBlogPage = () => {
  const { userInfo } = useAuth();
  const token = localStorage.getItem("token");
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const { slug } = useParams("slug");
  const [topics, setTopics] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [showIsSaved, setShowIsSaved] = useState(false);
  const [content, setContent] = useState("");
  const [idDraft, setIdDraft] = useState("");
  const [preview, setPreview] = useState("");
  const [authorSlug, setAuthorSlug] = useState("");
  const { image, setImage, onSelectImage, onDeleteImage } = useUploadImage();

  const navigate = useNavigate();
  function resetForm(data) {
    // console.log("data:", data);
    if (!data) return;
    if (data.length === 0) return;
    const title = data?.title;
    const preview = data?.preview;
    reset({ title, preview });
    setIdDraft(data.id);
    setImage({
      url: `${config.SERVER_HOST}/file/${data?.banner}`,
      filename: data?.banner,
    });
    setContent(data?.content);
    setTopics(data?.articleTopics);
    setAuthorSlug(data?.author?.username);
  }

  useEffect(() => {
    async function fetchBlog() {
      try {
        const response = await apiGetArticleOrDraft(slug);
        if (response) resetForm(response.data);
        console.log(response);
      } catch (error) {
        // navigate("/*");
        console.log("error", error);
      }
    }
    fetchBlog();
  }, [slug]);

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
    const topicsId = topics?.map((topic) => topic._id);
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

  const handleClickPublish = () => {
    handleSubmit(handleEditBlog)();
    console.log("submit");
  };

  const handleEditBlog = async (values) => {
    if (!isValid) return;
    if (!image)
      toast.error("Please fill out your image title!", {
        pauseOnHover: false,
        delay: 500,
      });
    const { title, content, preview } = values;
    // const cutPreview = preview.slice(0, 200);
    const topicNames = topics.map((val) => val.name);
    const formData = {
      title,
      content,
      topicNames,
      preview,
      banner: image.filename,
    };
    if (!token) return null;
    const response = await apiUpdateArticle(token, slug, formData);
    if (response) {
      navigate(`/profile/${authorSlug}`);
    }
  };
  const watchedTitle = useWatch({ control, name: "title", defaultValue: "" });
  const UpdateDraft = debounce(async () => {
    const res = await apiUpdateDarft(idDraft, watchedTitle, content);
    if (res?.success) {
      setIsSaved(true);
    }
  }, 1000);

  useEffect(() => {
    // console.log("title",watchedTitle);
    // console.log("content",content);
    const check = content !== "" && watchedTitle !== "";
    if (!check) return;
    setIsSaved(false);
    const encoder = new TextEncoder();
    const byteSize = encoder.encode(content).length;
    if (byteSize >= 102400) {
      return;
    }
    if (idDraft) {
      UpdateDraft();
    }
    // console.log("newDraft",newDraft);
    // console.log("changeDraft",changeDraft);
  }, [watchedTitle, content]);

  return (
    <EditBlogPageStyle>
      <form onSubmit={handleSubmit(handleEditBlog)} autoComplete="off">
        <WriteHeader
          showIsSaved={showIsSaved}
          image={image.url}
          handleSelectImage={handleSelectImage}
          handleDeleteImage={handleDeleteImage}
          topics={topics}
          setTopics={setTopics}
          token={token}
          isSubmitting={isSubmitting}
          disabled={isSubmitting}
          handleClickPublish={handleClickPublish}
        />
        <InputHook
          className=""
          control={control}
          name="title"
          placeholder="Add title"
        ></InputHook>
        <MyEditor content={content} setContent={setContent}></MyEditor>
      </form>
    </EditBlogPageStyle>
  );
};

export default EditBlogPage;
