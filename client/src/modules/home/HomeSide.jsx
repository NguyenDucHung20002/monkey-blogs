// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import TopicList from "../topic/TopicList";
import styled from "styled-components";
import FollowingUserHandle from "../../components/following/FollowingUserHandle";
import { NavLink } from "react-router-dom";
import apiSuggestionTopics from "../../api/apiSuggestionTopics";
import apiSuggestionUsers from "../../api/apiSuggestionUsers";
import apiGetMyFollowingTopics from "../../api/apiGetMyFollowingTopics";
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
      const response = await apiGetMyFollowingTopics(token);
      if (response) setTopicFollowings(response.data);
    }
    fetchTopic();
  }, [token]);

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
