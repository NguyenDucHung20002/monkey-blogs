import TopicSlider from "../modules/topic/TopicSlider";
import TopicDisplay from "../modules/topic/TopicDisplay";
import ArticleList from "../modules/article/ArticleList";
import { useNavigate, useParams } from "react-router-dom";
import ShowAllTopic from "../modules/topic/ShowAllTopic";
import { useEffect, useState } from "react";
import { config } from "../utils/constants";
import axios from "axios";

const TopicPage = () => {
  const { slug } = useParams();
  const [blogs, setBlogs] = useState(null);
  const [topic, setTopic] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchTopic() {
      try {
        const response = await axios.get(
          `${config.SERVER_HOST}/topic/${slug}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data) setTopic(response.data.data);
      } catch (error) {
        if (error.response.status === 404) navigate("/*");
      }
    }
    async function fetchBlog() {
      try {
        const response = await axios.get(
          `${config.SERVER_HOST}/topic/tag/${slug}/articles `,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data) setBlogs(response.data.data);
      } catch (error) {
        console.log("error:", error);
      }
    }
    fetchBlog();
    fetchTopic();
  }, [slug]);
  return (
    <>
      <div className="container w-full border-t border-gray-300"></div>
      <div className="max-w-[1200px] mx-auto">
        <TopicSlider slug={slug} />
        {topic && <TopicDisplay topic={topic} />}
        {slug === "explore-topics" ? (
          <ShowAllTopic />
        ) : (
          <ArticleList
            blogs={blogs}
            className="gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
          />
        )}
      </div>
    </>
  );
};

export default TopicPage;
