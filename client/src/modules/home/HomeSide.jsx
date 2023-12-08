// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import TopicList from "../topic/TopicList";
import styled from "styled-components";
import FollowingUserHandle from "../../components/following/FollowingUserHandle";
import { NavLink } from "react-router-dom";
import { useStickyBox } from "react-sticky-box";
import BlogStaffPick from "../blog/BlogStaffPick";
import { apiSuggestionTopics, apiSuggestionUsers } from "../../api/api";
import { apiGetReadingList, apiGetStaffPick } from "../../api/apisHung";
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
  const [staffPick, setStaffPick] = useState([]);
  const [readingList, setReadingList] = useState([]);
  const token = localStorage.getItem("token");
  const stickyRef = useStickyBox({ offsetTop: 60, offsetBottom: 30 });

  const methods = {
    async fetchReadingList() {
      const dataBlogs = await apiGetReadingList(token, 4);
      if (dataBlogs?.success) setReadingList(dataBlogs.data);
    },
    async fetchStaffPick() {
      const response = await apiGetStaffPick(token);
      if (response) setStaffPick(response.data);
    },
    async fetchSuggestionTopics() {
      const response = await apiSuggestionTopics(token);
      if (response) setTopics(response.data);
    },

    async fetchSuggestionUsers() {
      const response = await apiSuggestionUsers(token);
      if (response) setUsers(response.data);
    },
  };

  useEffect(() => {
    Promise.all([
      methods.fetchReadingList(),
      methods.fetchStaffPick(),
      methods.fetchSuggestionTopics(),
      methods.fetchSuggestionUsers(),
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <HomeSideStyle ref={stickyRef}>
      <div className="home-side">
        <div className="pb-4 mb-5 border-b border-gray-200">
          <h3 className="mb-2 text-lg font-semibold">Staff picks</h3>
          {staffPick && staffPick.length > 0 ? (
            <>
              {staffPick.map((blog) => (
                <BlogStaffPick blog={blog} key={blog.id}></BlogStaffPick>
              ))}
              <div className="mt-3">
                <NavLink to={"/me/suggestions"}>
                  <button className="font-medium text-blue-500 hover:text-blue-400">
                    See the full list
                  </button>
                </NavLink>
              </div>
            </>
          ) : (
            <p className="font-medium text-gray-400">Nothing here right now</p>
          )}
        </div>

        <div className="pb-4 mb-5 border-b border-gray-200">
          {topics && topics.length > 0 && (
            <>
              <h3 className="mb-5 text-base font-semibold">
                Recommended topics
              </h3>
              <TopicList data={topics}></TopicList>
            </>
          )}
        </div>
        <div className="pb-4 mb-5 border-b border-gray-200">
          {users && users.length > 0 && (
            <>
              {users.length >= 5 && (
                <h3 className="mb-3 text-base font-semibold">Who to follow</h3>
              )}
              {users.map((user) => (
                <FollowingUserHandle
                  key={user.id}
                  data={user}
                ></FollowingUserHandle>
              ))}
              <div className="mt-3">
                <NavLink to={"/me/suggestions"}>
                  <button className="font-medium text-blue-500 hover:text-blue-400 ">
                    See more suggestions
                  </button>
                </NavLink>
              </div>
            </>
          )}
        </div>
        <div className="mb-5">
          {readingList && readingList.length > 0 && (
            <>
              <h3 className="mb-3 text-base font-semibold">Recently saved</h3>
              {readingList.map((blog) => (
                <BlogStaffPick blog={blog} key={blog.id}></BlogStaffPick>
              ))}
              {readingList.length >= 4 && (
                <div className="mt-3">
                  <NavLink to={"/me/suggestions"}>
                    <button className="font-medium text-blue-500 hover:text-blue-400 ">
                      See all
                    </button>
                  </NavLink>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </HomeSideStyle>
  );
};

export default HomeSide;
