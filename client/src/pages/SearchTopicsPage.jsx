import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { config } from "../utils/constants";
import axios from "axios";
import TopicUserHandle from "../components/topic/TopicUserHandle";

const SearchTopicsPage = () => {
  const [topics, setTopics] = useState([]);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("q");
  useEffect(() => {
    async function fetchTopics() {
      try {
        const response = await axios.post(
          `${config.SERVER_HOST}:${config.SERVER_PORT}/api/article/topics`,
          {
            search,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response?.data) setTopics(response.data?.data);
      } catch (error) {
        console.log("error:", error);
      }
    }
    fetchTopics();
  }, [search]);

  return (
    <div className="max-w-[700px] w-full mx-auto px-5 mt-5">
      {topics &&
        topics.length > 0 &&
        topics.map((topic) => (
          <TopicUserHandle key={topic._id} data={topic}></TopicUserHandle>
        ))}
    </div>
  );
};

export default SearchTopicsPage;
