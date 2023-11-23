import { useEffect, useState } from "react";
import FollowingUserHandle from "../components/following/FollowingUserHandle";
import TopicUserHandle from "../components/topic/TopicUserHandle";
import axios from "axios";
import { config } from "../utils/constants";
import { toast } from "react-toastify";

const MeSuggestionPage = () => {
  const [topics, setTopics] = useState([]);
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchTopic() {
      try {
        const response = await axios.get(
          `${config.SERVER_HOST}topic/me/suggestions`,
          {
            headers: {
              authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data) setTopics(response.data.data);
      } catch (error) {
        console.log("error:", error);
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
          `${config.SERVER_HOST}/user/me/suggestions`,
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
