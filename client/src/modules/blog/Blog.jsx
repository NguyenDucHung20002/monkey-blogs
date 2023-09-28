// eslint-disable-next-line no-unused-vars
import React from "react";
import BlogImage from "./BlogImage";
import logo from "../../assets/logo.jpg";
import BlogMeta from "./BlogMeta";
import BlogTitle from "./BlogTitle";
import styled from "styled-components";
import { Avatar } from "antd";
import { Link } from "react-router-dom";
import Topic from "../topic/Topic";

const BlogStyle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 700px;
  width: 100%;
  margin: 0 auto;
  padding-bottom: 10px;
`;

const Blog = () => {
  return (
    <BlogStyle className="border-b border-gray-300">
      <div className="flex-1 p-3">
        <div className="flex items-center">
          <Link to={`/author`}>
            <Avatar
              className="cursor-pointer"
              size="medium"
              src={<img src={logo} alt="avatar" />}
            />
          </Link>
          <p className="mx-2"> </p>
          <BlogMeta></BlogMeta>
        </div>
        <p className="my-3"> </p>
        <BlogTitle size="big">
          <p className="line-clamp-3">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga
            ducimus ut sed, nesciunt doloremque incidunt perferendis iure in
            atque dolore inventore possimus sit? Atque adipisci ab repudiandae
            animi, deserunt nisi!
          </p>
        </BlogTitle>
        <p className="my-3"> </p>
        <div>
          <Topic>Hentai</Topic>
        </div>
      </div>
      <BlogImage
        className="flex-shrink-0"
        url={logo}
        alt=""
        to={"/"}
      ></BlogImage>
    </BlogStyle>
  );
};

export default Blog;
