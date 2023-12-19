/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from "react";
import FollowingUserHandle from "../components/following/FollowingUserHandle";
import TopicUserHandle from "../components/topic/TopicUserHandle";
import { apiSuggestionTopics, apiSuggestionUsers } from "../api/api";

const MeSuggestionPage = () => {
  const [topics, setTopics] = useState([]);
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  const [isLoadNewUsers, setIsLoadNewUsers] = useState(false);
  const [isLoadNewTopics, setIsLoadNewTopics] = useState(false);

  useEffect(() => {
    async function fetchTopic() {
      const response = await apiSuggestionTopics(token, 10);
      if (response) setTopics(response.data);
    }
    fetchTopic();
  }, [token, isLoadNewTopics]);
  useEffect(() => {
    async function fetchTopic() {
      const response = await apiSuggestionUsers(token, 10);
      if (response) setUsers(response.data);
    }
    fetchTopic();
  }, [token, isLoadNewUsers]);

  return (
    <div>
      <div className="user-following max-w-[700px] w-full mx-auto">
        <div className="mt-6">
          <h3 className="mb-3 text-base font-bold">Who to follow</h3>
          {users &&
            users.length > 0 &&
            users.map((user) => (
              <FollowingUserHandle
                key={user.id}
                data={user}
              ></FollowingUserHandle>
            ))}
          <button
            className="mt-3 text-blue-400 hover:text-blue-500 "
            onClick={() => setIsLoadNewUsers(!isLoadNewUsers)}
          >
            Refresh new who to follow
          </button>
        </div>
        <div className="mt-6 ">
          <h3 className="mb-3 text-base font-bold">Topics to follow</h3>
          {topics &&
            topics.length > 0 &&
            topics.map((topic) => (
              <TopicUserHandle key={topic.id} data={topic}></TopicUserHandle>
            ))}
          <button
            className="mt-3 text-blue-400 hover:text-blue-500 "
            onClick={() => setIsLoadNewTopics(!isLoadNewTopics)}
          >
            Refresh Recommend topics
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeSuggestionPage;
