import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const NotFoundPageStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  .logo {
    display: inline-block;
    margin-bottom: 40px;
  }
  .heading {
    font-size: 60px;
    font-weight: 600;
    margin-bottom: 40px;
  }
  .back {
    display: inline-block;
    padding: 15px 30px;
    color: white;
    background-color: ${(props) => props.theme.primary};
    border-radius: 4px;
    font-weight: 500;
  }
`;

const NotFoundPage = () => {
  return (
    <NotFoundPageStyled>
      <NavLink to={"/"} className={"logo"}>
        <img
          className="logo"
          srcSet="/logo/monkey-logo.png 2x"
          alt="monkey-logo"
        />
      </NavLink>
      <h1 className="heading">Oops! page not found</h1>
      <NavLink to={"/"} className={"back"}>
        Bacl to Home
      </NavLink>
    </NotFoundPageStyled>
  );
};

export default NotFoundPage;
