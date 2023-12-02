import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import TopicUserHandle from "../components/topic/TopicUserHandle";
import { apiTopicsSearch } from "../api/apisHung";

const SearchTopicsPage = () => {
  const [topics, setTopics] = useState([]);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("q");
  const token = localStorage.getItem("token");
  useEffect(() => {
    async function fetchTopics() {
      try {
        const response = await apiTopicsSearch(token, search, 15);
        if (response?.success) setTopics(response.data);
      } catch (error) {
        console.log("error:", error);
      }
    }
    fetchTopics();
  }, [search, token]);

  return (
    <div className="max-w-[700px] w-full mx-auto px-5 mt-5">
      {topics &&
        topics.length > 0 &&
        topics.map((topic) => (
          <TopicUserHandle key={topic.id} data={topic}></TopicUserHandle>
        ))}
    </div>
  );
};

export default SearchTopicsPage;
