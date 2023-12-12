import TopicDisplay from "../modules/topic/TopicDisplay";
import ArticleList from "../modules/article/ArticleList";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { apiGetTopic } from "../api/api";
import { apiGetBlogsTopic } from "../api/apisHung";

const TopicPage = () => {
  const { slug } = useParams();
  const [blogs, setBlogs] = useState(null);
  const [topic, setTopic] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchATopic = useCallback(async () => {
    const response = await apiGetTopic(token, slug);
    if (response.data) setTopic(response.data);
    else navigate("/");
  }, [navigate, slug, token]);

  useEffect(() => {
    fetchATopic();
  }, [fetchATopic]);

  const fetchBlogsTopic = useCallback(async () => {
    const response = await apiGetBlogsTopic(token, slug);
    console.log("response:", response);
    if (response.data) setBlogs(response.data);
  }, [slug, token]);

  useEffect(() => {
    fetchBlogsTopic();
  }, [fetchBlogsTopic]);

  return (
    <>
      <div className="container w-full border-t border-gray-300"></div>
      <div className="max-w-[1200px] mx-auto ">
        {topic && <TopicDisplay topic={topic} />}
        <ArticleList
          blogs={blogs}
          className="gap-8 p-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
        />
      </div>
    </>
  );
};

export default TopicPage;
