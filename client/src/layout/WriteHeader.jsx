/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Avatar, Space, Popover } from "antd";
import styled from "styled-components";
import logo from "../assets/logo.jpg";
import { Button } from "../components/button";
import { useAuth } from "../contexts/auth-context";

const icons = {
  libraryIcon: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Lists"
    >
      <path
        d="M6.44 6.69h0a1.5 1.5 0 0 1 1.06-.44h9c.4 0 .78.16 1.06.44l.35-.35-.35.35c.28.28.44.66.44 1.06v14l-5.7-4.4-.3-.23-.3.23-5.7 4.4v-14c0-.4.16-.78.44-1.06z"
        stroke="currentColor"
      ></path>
      <path
        d="M12.5 2.75h-8a2 2 0 0 0-2 2v11.5"
        stroke="currentColor"
        strokeLinecap="round"
      ></path>
    </svg>
  ),

  notificationIcon: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-7 h-7"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
      />
    </svg>
  ),
  userIcon: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
  ),
  storyIcon: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Stories"
    >
      <path
        d="M4.75 21.5h14.5c.14 0 .25-.11.25-.25V2.75a.25.25 0 0 0-.25-.25H4.75a.25.25 0 0 0-.25.25v18.5c0 .14.11.25.25.25z"
        stroke="currentColor"
      ></path>
      <path
        d="M8 8.5h8M8 15.5h5M8 12h8"
        stroke="currentColor"
        strokeLinecap="round"
      ></path>
    </svg>
  ),
};

const HomeStyle = styled.header`
  padding: 10px 0;
  background-color: white;
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  .header-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .logo {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const WriteHeader = () => {
  const { userInfo, setUserInfo } = useAuth();
  const { data } = userInfo;
  const navigate = useNavigate();

  const handleSignOut = () => {
    setUserInfo({});
    localStorage.removeItem("token");
    navigate("/sign-in");
  };

  const content = useCallback(function (username, fullname) {
    return (
      <div className="w-[250px] block">
        <h2 className="pb-2 text-sm font-semibold border-b border-gray-300">
          {fullname && fullname?.length > 8
            ? fullname.slice(0, 8) + "..."
            : fullname}
        </h2>
        <NavLink to={`/profile`}>
          <div className="flex items-center justify-start my-4">
            {icons.userIcon} <p className="ml-3">Profile</p>
          </div>
        </NavLink>
        <NavLink to={`/library`}>
          <div className="flex items-center justify-start my-4">
            {icons.libraryIcon} <p className="ml-3">Library</p>
          </div>
        </NavLink>
        <NavLink to={`/stories`}>
          <div className="flex items-center justify-start my-4">
            {icons.storyIcon} <p className="ml-3">Stories</p>
          </div>
        </NavLink>
        <div className="w-full border-t border-gray-300 btn-sign-out text-start">
          <button
            onClick={handleSignOut}
            className="block px-2 py-2 text-gray-400 hover:text-gray-600"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }, []);

  return (
    <>
      <HomeStyle>
        <div className="flex items-center justify-between ">
          <div className="flex items-center justify-center header-right">
            <NavLink to="/" className="w-10 h-10">
              <img srcSet={logo} alt="monkey-blogging" className="logo" />
            </NavLink>
            <p className="ml-3 text-sm">
              Draft in{" "}
              {data?.fullname && data?.fullname?.length > 10
                ? data?.fullname.slice(0, 10) + "..."
                : data?.fullname}
            </p>
          </div>
          <div className="flex items-center justify-center header-left">
            <Button
              kind="secondary"
              height="40px"
              notification={"1"}
              className=""
            >
              {icons.notificationIcon}
            </Button>
            <Space direction="vertical" wrap size={16} className="p-1 ml-5">
              <Popover
                placement="bottomRight"
                content={() => content(data?.username, data?.fullname)}
                trigger="click"
              >
                <Avatar
                  className="cursor-pointer"
                  size="large"
                  src={<img src={data?.avatar} alt="avatar" />}
                />
              </Popover>
            </Space>
          </div>
        </div>
      </HomeStyle>
    </>
  );
};

export default WriteHeader;
