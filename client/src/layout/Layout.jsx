// eslint-disable-next-line no-unused-vars
import React, { Fragment, useEffect } from "react";
import Header from "./Header";
import styled from "styled-components";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";
const LayoutStyle = styled.div``;
// eslint-disable-next-line react/prop-types
const Layout = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const { data } = userInfo;
  console.log("data:", data);
  useEffect(() => {
    // if (!data) navigate("/sign-in");
  }, [navigate, data]);

  return (
    <LayoutStyle>
      <Header></Header>
      <Outlet></Outlet>
    </LayoutStyle>
  );
};

export default Layout;
