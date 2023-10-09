// eslint-disable-next-line no-unused-vars
import React, { useEffect } from "react";
import styled from "styled-components";
import Blog from "../blog/Blog";
import { toast } from "react-toastify";
import { config } from "../../utils/constants";
import axios from "axios";

const HomeMainStyled = styled.div`
  padding-top: 30px;
`;

const HomeMain = () => {
  useEffect(() => {
    async function fetchBlog() {
      try {
        const response = await axios.get(
          `${config.SERVER_HOST}:${config.SERVER_PORT}/api/article/?tag=reactjs`,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("response:", response.data);
      } catch (error) {
        toast.error("Some thing was wrong!", {
          pauseOnHover: false,
          delay: 500,
        });
      }
    }
    fetchBlog();
  }, []);

  return (
    <HomeMainStyled>
      <Blog></Blog>
      <Blog></Blog>
      <Blog></Blog>
      <Blog></Blog>
      <Blog></Blog>
      <Blog></Blog>
      <Blog></Blog>
      <Blog></Blog>
      <Blog></Blog>
      <Blog></Blog>
      <Blog></Blog>
      <Blog></Blog>
      <Blog></Blog>
      <Blog></Blog>
      <Blog></Blog>
      <Blog></Blog>
      <Blog></Blog>
      <Blog></Blog>
      <Blog></Blog>
      <Blog></Blog>
      <Blog></Blog>
    </HomeMainStyled>
  );
};

export default HomeMain;
