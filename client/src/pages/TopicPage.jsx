import TopicDisplay from "../modules/topic/TopicDisplay";
import ArticleList from "../modules/article/ArticleList";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiGetTopic } from "../api/api";

const TopicPage = () => {
  const { slug } = useParams();
  console.log("slug:", slug);
  const [blogs, setBlogs] = useState(null);
  const [topic, setTopic] = useState(null);
  console.log("topic:", topic);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchATopic() {
      const response = await apiGetTopic(token, slug);
      if (response.data) setTopic(response.data);
      else navigate("/");
    }
    fetchATopic();
  }, [slug, token]);
  return (
    <>
      <div className="container w-full border-t border-gray-300"></div>
      <div className="max-w-[1200px] mx-auto">
        {topic && <TopicDisplay topic={topic} />}
        <ArticleList
          blogs={blogs}
          className="gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
        />
      </div>
    </>
  );
};

export default TopicPage;
