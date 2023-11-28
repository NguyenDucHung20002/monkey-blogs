// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Blog from "../modules/blog/Blog";
import { apiMyArticleFollowing } from "../api/api";

const FollowingPageStyled = styled.div`
  max-width: 700px;
  width: 100%;
  margin: 0 auto;
`;

const FollowingPage = () => {
  const token = localStorage.getItem("token");
  const [blogs, setBlogs] = useState([]);
  console.log("blogs:", blogs);
  useEffect(() => {
    async function fetchBlog() {
      const response = apiMyArticleFollowing(token);
      if (response) setBlogs(response.data);
      console.log("response.data:", response.data);
    }
    fetchBlog();
  }, [token]);

  return (
    <FollowingPageStyled>
      <div>
        {blogs &&
          blogs.length > 0 &&
          blogs.map((blog) => <Blog key={blog._id} blog={blog}></Blog>)}
      </div>
    </FollowingPageStyled>
  );
};

export default FollowingPage;
