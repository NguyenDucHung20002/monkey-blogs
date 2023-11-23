// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import TopicList from "../topic/TopicList";
import styled from "styled-components";
import { toast } from "react-toastify";
import { config } from "../../utils/constants";
import axios from "axios";
import FollowingUserHandle from "../../components/following/FollowingUserHandle";
import { NavLink } from "react-router-dom";
const HomeSideStyle = styled.div`
  padding: 30px 0 0 30px;
  min-height: calc(100vh - 70px);

  .home-side {
    max-width: 400px;
    width: 100%;
  }
`;

const HomeSide = () => {
  const [topics, setTopics] = useState([]);
  const [users, setUsers] = useState([]);
  const [topicFollowings, setTopicFollowings] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchTopic() {
      try {
        const response = await axios.get(
          `${config.SERVER_HOST}/user/me/following/topics`,
          {
            headers: {
              authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data) setTopicFollowings(response.data.data);
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
          `${config.SERVER_HOST}/topic/me/suggestions`,
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
    <HomeSideStyle className="border-l border-gray-300">
      <div className="home-side">
        <div className="mb-5">
          {topics && topics.length > 0 && (
            <>
              <h3 className="mb-5 text-lg font-semibold">Topics followed</h3>
              <TopicList data={topicFollowings}></TopicList>
            </>
          )}
        </div>
        <div className="mb-5">
          {topics && topics.length > 0 && (
            <>
              <h3 className="mb-5 text-lg font-semibold">Random topics</h3>
              <TopicList data={topics}></TopicList>
            </>
          )}
        </div>
        <div className="mb-5">
          {users && users.length > 0 && (
            <>
              <h3 className="mb-5 text-lg font-semibold">Who to follow</h3>
              {users.map((user) => (
                <FollowingUserHandle
                  key={user._id}
                  data={user}
                ></FollowingUserHandle>
              ))}
              <NavLink to={"/me/suggestions"}>
                <button className="ml-1">see more suggestions</button>
              </NavLink>
            </>
          )}
        </div>
      </div>
    </HomeSideStyle>
  );
};

export default HomeSide;
