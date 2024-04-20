import FollowingUserHandle from "../components/following/FollowingUserHandle";
import TopicUserHandle from "../components/topic/TopicUserHandle";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/auth-context";
import { apiGetFollowedTopics } from "../api/api";
import { apiGetFollowedProfiles } from "../api/apisHung";

const MeFollowingPage = () => {
  const [topics, setTopics] = useState([]);
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  const { userInfo } = useAuth();

  useEffect(() => {
    async function fetchTopic() {
      const response = await apiGetFollowedTopics(token);
      if (response) setTopics(response.data);
    }
    fetchTopic();
  }, [token]);

  useEffect(() => {
    async function fetchUser() {
      const username = userInfo?.data?.username;
      if (username) {
        const response = await apiGetFollowedProfiles(token, username, 15);
        if (response) {
          setUsers(response.data);
        }
      }
    }
    fetchUser();
  }, [token, userInfo?.data?.username]);

  if (!userInfo) return;

  return (
    <div>
      <div className="user-following max-w-[700px] w-full mx-auto">
        <div className="pb-4 mt-6 ">
          <h3 className="mb-3 text-base font-bold">Authors followed</h3>
          {users &&
            users.length > 0 &&
            users.map((user) => (
              <FollowingUserHandle
                key={user.id}
                data={user}
                initialFollowing={true}
              ></FollowingUserHandle>
            ))}
        </div>
        <div className="mt-6">
          <h3 className="mb-3 text-base font-bold">Topics followed</h3>
          {topics &&
            topics.length > 0 &&
            topics.map((topic) => (
              <TopicUserHandle
                key={topic.id}
                data={topic}
                initialFollowing={true}
              ></TopicUserHandle>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MeFollowingPage;
