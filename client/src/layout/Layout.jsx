// eslint-disable-next-line no-unused-vars
import React, { Fragment } from "react";
import Header from "./Header";
import styled from "styled-components";
import { Outlet } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";
import PageNotFound from "../pages/PageNotFound";
const LayoutStyle = styled.div``;
// eslint-disable-next-line react/prop-types
const Layout = () => {
  const { userInfo } = useAuth();
  if (!userInfo) return <PageNotFound></PageNotFound>;
  return (
    <LayoutStyle>
      <Header></Header>
      <Outlet></Outlet>
    </LayoutStyle>
  );
};

export default Layout;
