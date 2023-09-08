import React from "react";
import styled from "styled-components";
import { useAuth } from "../contexts/authContext";
import { Button } from "../components/button";
import { NavLink } from "react-router-dom";

const arrMenu = [
  {
    url: "/#",
    title: "Home",
  },
  {
    url: "/blog",
    title: "Blog",
  },
  {
    url: "/contact",
    title: "Contact",
  },
];

function getLastName(name) {
  if (!name) return "Wellcome back ";
  const length = name.split(" ").length;
  return name.split(" ")[length - 1];
}

const HeaderStyled = styled.header`
  padding: 40px 0;
  .header-main {
    display: flex;
    align-items: center;
  }
  .logo {
    display: block;
    max-width: 50px;
  }
  .menu {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-left: 40px;
    list-style: none;
    font-weight: 500;
  }

  .search {
    position: relative;
    padding: 15px 25px;
    margin-left: auto;
    border: 1px solid #ccc;
    border-radius: 8px;
    max-width: 320px;
    display: flex;
    align-items: center;
    margin-right: 20px;
  }
  .search-input {
    flex: 1;
    padding-right: 45px;
    font-weight: 500;
  }
  .search-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 15px;
  }
`;

const Header = () => {
  const { userInfo } = useAuth();
  return (
    <HeaderStyled>
      <div className="container">
        <div className="header-main">
          <NavLink to="/">
            <img
              className="logo"
              srcSet="/logo/monkey-logo.png 2x"
              alt="monkey-logo"
            />
          </NavLink>
          <ul className="menu">
            {arrMenu.map((items) => (
              <li className="menu-item" key={items.title}>
                <NavLink to={items.url}>{items.title}</NavLink>
              </li>
            ))}
          </ul>
          <div className="search">
            <input
              type="text"
              className="search-input"
              placeholder="Search posts"
            />
            <span className="search-icon">
              <svg
                width="18"
                height="17"
                viewBox="0 0 18 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <ellipse
                  cx="7.66669"
                  cy="7.05161"
                  rx="6.66669"
                  ry="6.05161"
                  stroke="#999999"
                  strokeWidth="1.5"
                />
                <path
                  d="M17.0001 15.5237L15.2223 13.9099L14.3334 13.103L12.5557 11.4893"
                  stroke="#999999"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M11.6665 12.2964C12.9671 12.1544 13.3706 11.8067 13.4443 10.6826"
                  stroke="#999999"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </div>
          {!userInfo ? (
            <Button
              kind="primary"
              type="button"
              height={"56px"}
              to={"/sign-up"}
              className="header-button"
            >
              Sign up
            </Button>
          ) : (
            <div className="header-auth">
              <strong>Hi,</strong>{" "}
              <span className="text-primary">
                {getLastName(userInfo?.displayName)}
              </span>
            </div>
          )}
        </div>
      </div>
    </HeaderStyled>
  );
};

export default Header;
