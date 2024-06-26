import TopicDisplay from "../modules/topic/TopicDisplay";
import ArticleList from "../modules/article/ArticleList";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { apiGetATopic } from "../api/api";
import { apiGetTopicArticles } from "../api/apisHung";

const TopicPage = () => {
  const { slug } = useParams();
  const [blogs, setBlogs] = useState(null);
  const [topic, setTopic] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const newSkip = useRef("");

  const fetchATopic = useCallback(async () => {
    const response = await apiGetATopic(token, slug);
    if(!response) navigate("/*")
    
    setTopic(response.data);
  }, [navigate, slug, token]);

  useEffect(() => {
    fetchATopic();
  }, [fetchATopic]);

  const fetchBlogsTopic = useCallback(async () => {
    const response = await apiGetTopicArticles(token, slug, 9);
    if (response.data) {
      newSkip.current = response.newSkip;
      setBlogs(response.data);
      return response.data;
    }
    return [];
  }, [slug, token]);

  useEffect(() => {
    fetchBlogsTopic();
  }, [fetchBlogsTopic]);

  const handleLoadMore = async () => {
    const response = await apiGetTopicArticles(token, slug, 9, newSkip.current);
    if (response.data) {
      newSkip.current = response.newSkip;
      setBlogs([...blogs, ...response.data]);
    }
  };

  return (
    <>
      <div className="max-w-[1200px] mx-auto ">
        {topic && <TopicDisplay topic={topic} />}
        <ArticleList
          blogs={blogs}
          className="gap-8 p-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
        />
        {blogs?.length >= 9 && newSkip.current && (
          <div className="mb-10 px-5 flex justify-center mt-2">
            <button
              className="border border-black py-1 px-3 rounded-2xl font-semibold hover:bg-black hover:text-white transition-all"
              onClick={handleLoadMore}
            >
              See more stories
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default TopicPage;
