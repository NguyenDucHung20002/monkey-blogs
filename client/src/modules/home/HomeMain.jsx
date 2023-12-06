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
  padding: 0 20px;
`;

const HomeMain = () => {
  const token = localStorage.getItem("token");
  const [blogs, setBlogs] = useState([]);
  const blogRef = useRef();
  const skip = useRef("");
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [scrollY, setScrollY] = useState(window.scrollY);
  const [documentHeight, setDocumentHeight] = useState(
    document.documentElement.scrollHeight
  );

  useEffect(() => {
    async function fetchBlog() {
      const response = await apiGetArticleSkip("", token);
      // console.log("response:", response);
      if (response?.success) {
        setBlogs([...response.data]);
        skip.current = response.newSkip;
      }
    }
    fetchBlog();
  }, []);

  useEffect(() => {
    const handleScroll = async () => {
      setWindowHeight(window.innerHeight);
      setScrollY(window.scrollY);
      setDocumentHeight(document.documentElement.scrollHeight);
      if (windowHeight + scrollY >= documentHeight && skip.current) {
        const skipId = skip.current;
        const response = await apiGetArticleSkip(skipId, token);
        if (response) {
          const blogsClone = [...blogs, ...response.data];
          setBlogs([...blogsClone]);
          skip.current = response.newSkip;
        }
      }
    };
    const debouncedScroll = debounce(handleScroll, 200);

    window.addEventListener("scroll", debouncedScroll);

    return () => {
      window.removeEventListener("scroll", debouncedScroll);
    };
  }, []);

  return (
    <HomeMainStyled ref={blogRef}>
      <div>
        {blogs &&
          blogs.length > 0 &&
          blogs.map((blog) => <Blog key={blog.id} blog={blog}></Blog>)}
      </div>
    </HomeMainStyled>
  );
};

export default HomeMain;
