import { useEffect, useState } from "react";
import FollowingUserHandle from "../components/following/FollowingUserHandle";
import TopicUserHandle from "../components/topic/TopicUserHandle";
import { apiSuggestionTopics, apiSuggestionUsers } from "../api/api";

const MeSuggestionPage = () => {
  const [topics, setTopics] = useState([]);
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchTopic() {
      const response = await apiSuggestionTopics(token);
      if (response) setTopics(response.data);
    }
    fetchTopic();
  }, [token]);
  useEffect(() => {
    async function fetchTopic() {
      const response = await apiSuggestionUsers(token);
      if (response) setUsers(response.data);
    }
    fetchTopic();
  }, [token]);

  return (
    <div>
      <div className="user-following max-w-[700px] w-full mx-auto">
        <div className="mt-6 border-b border-gray-300">
          <h3 className="text-base font-bold">Who to follow</h3>
          {users &&
            users.length > 0 &&
            users.map((user) => (
              <FollowingUserHandle
                key={user._id}
                data={user}
              ></FollowingUserHandle>
            ))}
        </div>
        <div className="mt-6 border-b border-gray-300">
          <h3 className="text-base font-bold">Topics to follow</h3>
          {topics &&
            topics.length > 0 &&
            topics.map((topic) => (
              <TopicUserHandle key={topic._id} data={topic}></TopicUserHandle>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MeSuggestionPage;
