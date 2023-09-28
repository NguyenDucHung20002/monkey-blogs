// eslint-disable-next-line no-unused-vars
import React, { Fragment } from "react";
import Header from "./Header";
import styled from "styled-components";
const LayoutStyle = styled.div`
  padding: 0 20px;
`;
// eslint-disable-next-line react/prop-types
const Layout = ({ children }) => {
  return (
    <LayoutStyle>
      <Header></Header>
      {children}
    </LayoutStyle>
  );
};

export default Layout;
