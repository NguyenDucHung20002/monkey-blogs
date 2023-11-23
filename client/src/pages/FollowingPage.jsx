// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import axios from "axios";
import Blog from "../modules/blog/Blog";
import { config } from "../utils/constants";

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
      try {
        const response = await axios.get(
          `${config.SERVER_HOST}/article/?feed=following`,
          {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data) setBlogs(response.data.data);
        console.log("response.data:", response.data);
      } catch (error) {
        toast.error("Some thing was wrong!", {
          pauseOnHover: false,
          delay: 500,
        });
      }
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
