/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Blog from "../blog/Blog";
import { toast } from "react-toastify";
import { config } from "../../utils/constants";
import axios from "axios";
import { debounce } from "lodash";

const HomeMainStyled = styled.div`
  max-width: 700px;
  width: 100%;
  margin: 0 auto 50px;
  overflow-y: auto;
  flex: 1;
  height: 100%;
`;

const HomeMain = () => {
  const token = localStorage.getItem("token");
  const [blogs, setBlogs] = useState([]);
  const blogRef = useRef();
  const [skipId, setSkipId] = useState(null);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [scrollY, setScrollY] = useState(window.scrollY);
  const [documentHeight, setDocumentHeight] = useState(
    document.documentElement.scrollHeight
  );

  useEffect(() => {
    async function fetchBlog() {
      try {
        const response = await axios.get(
          `${config.SERVER_HOST}:${config.SERVER_PORT}/api/article/?limit=${5}`,
          {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data) {
          setBlogs([...response.data.data]);
          setSkipId(response.data.skipID);
        }
      } catch (error) {
        toast.error("Some thing was wrong!", {
          pauseOnHover: false,
          delay: 500,
        });
      }
    }
    fetchBlog();
  }, []);

  useEffect(() => {
    const handleScroll = async () => {
      setWindowHeight(window.innerHeight);
      setScrollY(window.scrollY);
      setDocumentHeight(document.documentElement.scrollHeight);
      if (windowHeight + scrollY >= documentHeight && skipId) {
        try {
          const response = await axios.get(
            `${config.SERVER_HOST}:${
              config.SERVER_PORT
            }/api/article/?skip=${skipId}&limit=${5}`,
            {
              headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
              },
            }
          );
          if (response.data) {
            const blogsClone = [...blogs, ...response.data.data];
            setBlogs([...blogsClone]);
            setSkipId(response.data.skipID);
          }
        } catch (error) {
          toast.error("Some thing was wrong!", {
            pauseOnHover: false,
            delay: 500,
          });
        }
      }
    };
    const debouncedScroll = debounce(handleScroll, 200);

    window.addEventListener("scroll", debouncedScroll);

    return () => {
      window.removeEventListener("scroll", debouncedScroll);
    };
  }, [skipId]);

  return (
    <HomeMainStyled ref={blogRef}>
      <div>
        {blogs &&
          blogs.length > 0 &&
          blogs.map((blog) => <Blog key={blog._id} blog={blog}></Blog>)}
      </div>
    </HomeMainStyled>
  );
};

export default HomeMain;
