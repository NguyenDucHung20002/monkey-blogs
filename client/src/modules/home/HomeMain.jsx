// eslint-disable-next-line no-unused-vars
import React from "react";
import styled from "styled-components";
import Blog from "../blog/Blog";

const HomeMainStyled = styled.div`
  margin-top: 40px;
`;

const HomeMain = () => {
  return (
    <HomeMainStyled>
      <Blog></Blog>
      <Blog></Blog>
      <Blog></Blog>
      <Blog></Blog>
    </HomeMainStyled>
  );
};

export default HomeMain;
