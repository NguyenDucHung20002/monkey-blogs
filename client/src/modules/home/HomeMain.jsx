// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Blog from "../blog/Blog";
import { toast } from "react-toastify";
import { config } from "../../utils/constants";
import axios from "axios";
import { NavbarHome } from "../../components/navbar";

const HomeMainStyled = styled.div`
  padding-top: 30px;
  max-width: 700px;
  width: 100%;
  margin: 0 auto;
`;

const HomeMain = () => {
  const token = localStorage.getItem("token");
  const [blogs, setBlogs] = useState([]);
  console.log("blogs:", blogs);
  useEffect(() => {
    async function fetchBlog() {
      try {
        const response = await axios.get(
          `${config.SERVER_HOST}:${config.SERVER_PORT}/api/article`,
          {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data) setBlogs(response.data.data);
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
    <HomeMainStyled>
      <NavbarHome></NavbarHome>
      <div>
        {blogs &&
          blogs.length > 0 &&
          blogs.map((blog) => <Blog key={blog._id} blog={blog}></Blog>)}
      </div>
    </HomeMainStyled>
  );
};

export default HomeMain;
