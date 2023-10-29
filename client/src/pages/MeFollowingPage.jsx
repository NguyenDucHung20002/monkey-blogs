import { toast } from "react-toastify";
import FollowingUserHandle from "../components/following/FollowingUserHandle";
import TopicUserHandle from "../components/topic/TopicUserHandle";
import { config } from "../utils/constants";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/auth-context";

const MeFollowingPage = () => {
  const [topics, setTopics] = useState([]);
  console.log("topics:", topics);
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  const { userInfo } = useAuth();

  useEffect(() => {
    async function fetchTopic() {
      try {
        const response = await axios.get(
          `${config.SERVER_HOST}:${config.SERVER_PORT}/api/user/me/following/topics`,
          {
            headers: {
              authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data) setTopics(response.data.data);
      } catch (error) {
        toast.error("Some thing was wrong!", {
          pauseOnHover: false,
          delay: 500,
        });
      }
    }
    fetchTopic();
  }, [token]);
  useEffect(() => {
    async function fetchTopic() {
      try {
        const response = await axios.get(
          `${config.SERVER_HOST}:${config.SERVER_PORT}/api/user/${userInfo?.data?.username}/following `,
          {
            headers: {
              authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data) setUsers(response.data.data);
      } catch (error) {
        console.log("error:", error);
        toast.error("Some thing was wrong!", {
          pauseOnHover: false,
          delay: 500,
        });
      }
    }
    fetchTopic();
  }, [token, userInfo?.data?.username]);

  if (!userInfo) return;
  return (
    <div>
      <div className="user-following max-w-[700px] w-full mx-auto">
        <div className="mt-6 border-b border-gray-300">
          <h3 className="mb-3 text-base font-bold">Who to follow</h3>
          {users &&
            users.length > 0 &&
            users.map((user) => (
              <FollowingUserHandle
                key={user._id}
                data={user}
                initialFollowing={true}
              ></FollowingUserHandle>
            ))}
        </div>
        <div className="mt-6 border-b border-gray-300">
          <h3 className="mb-5 text-base font-bold">Topics to follow</h3>
          {topics &&
            topics.length > 0 &&
            topics.map((topic) => {
              console.log("topic:", topic);

              return (
                <TopicUserHandle
                  key={topic._id}
                  data={topic}
                  initialFollowing={true}
                ></TopicUserHandle>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default MeFollowingPage;
