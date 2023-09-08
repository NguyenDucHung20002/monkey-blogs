import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const AuthenticationPageStyled = styled.div`
  min-height: 100vh;
  padding: 40px;
  .logo {
    margin: 0 auto 20px;
  }
  .text-heading {
    text-align: center;
    color: ${(props) => props.theme.primary};
    font-weight: bold;
  }

  .form {
    max-width: 600px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
  }
  .have-account {
    margin-bottom: 20px;
    a {
      display: inline-block;
      color: ${(props) => props.theme.primary};
      font-weight: 500;
    }
  }
`;

const AuthenticationPage = ({ children }) => {
  return (
    <AuthenticationPageStyled>
      <div className="container">
        <NavLink to={"/"}>
          <img
            className="logo"
            srcSet="/logo/monkey-logo.png 2x"
            alt="monkey logo"
          />
        </NavLink>
        <h1 className="text-heading">Monkey Blog</h1>
        {children}
      </div>
    </AuthenticationPageStyled>
  );
};

export default AuthenticationPage;
