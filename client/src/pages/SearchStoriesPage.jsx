/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { config } from "../utils/constants";
import Blog from "../modules/blog/Blog";
import { useSearchParams } from "react-router-dom";

const SearchStoriesPageStyle = styled.div`
  max-width: 700px;
  width: 100%;
  margin: 0 auto;
`;

const SearchStoriesPage = () => {
  const token = localStorage.getItem("token");
  const [blogs, setBlogs] = useState([]);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("q");
  useEffect(() => {
    async function fetchBlog() {
      try {
        const response = await axios.post(
          `${config.SERVER_HOST}:${config.SERVER_PORT}/api/article/search`,
          {
            search,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data) setBlogs(response.data.data);
      } catch (error) {
        console.log("error:", error);
      }
    }
    fetchBlog();
  }, [search, token]);

  return (
    <SearchStoriesPageStyle>
      <div>
        {blogs &&
          blogs.length > 0 &&
          blogs.map((blog) => <Blog key={blog._id} blog={blog}></Blog>)}
      </div>
    </SearchStoriesPageStyle>
  );
};

export default SearchStoriesPage;
