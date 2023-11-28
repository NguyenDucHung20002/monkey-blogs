/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Blog from "../blog/Blog";
import { debounce } from "lodash";
import { apiGetArticleSkip } from "../../api/api";

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
      const response = await apiGetArticleSkip("", token);
      if (response.data) {
        setBlogs([...response.data]);
        setSkipId(response.skipID);
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
        const response = await apiGetArticleSkip(skipId, token);
        if (response) {
          const blogsClone = [...blogs, ...response.data];
          setBlogs([...blogsClone]);
          setSkipId(response.skipID);
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
