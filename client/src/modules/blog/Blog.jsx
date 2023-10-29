/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";
import BlogImage from "./BlogImage";
import BlogMeta from "./BlogMeta";
import BlogTitle from "./BlogTitle";
import styled from "styled-components";
import { Avatar } from "antd";
import { Link } from "react-router-dom";
import Topic from "../topic/Topic";
import useTimeAgo from "../../hooks/useTimeAgo";

const BlogStyle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin: 0 20px;
  padding-bottom: 20px;
`;

const Blog = ({ blog }) => {
  const { title, preview, img, slug, topics, author, createdAt } = blog;
  const getTimeAgo = useTimeAgo(createdAt);

  return (
    <BlogStyle className="border-b border-gray-300">
      <div className="flex-1 pt-3 pr-5">
        <div className="flex items-center">
          <Link to={`/profile/${author?.username}`}>
            <Avatar
              className="cursor-pointer"
              size="large"
              src={<img src={author?.avatar} alt="avatar" />}
            />
          </Link>
          <p className="mx-1"> </p>
          <BlogMeta
            authorName={author?.fullname}
            date={createdAt}
            to={author?.username}
          ></BlogMeta>
        </div>
        <p className="my-2"> </p>
        <BlogTitle to={`/blog/${slug}`} size="big">
          {title}
        </BlogTitle>
        <p className="mt-2 text-base text-gray-400 line-clamp-2">{preview}</p>
        <div className="flex items-center justify-start gap-3 mt-3">
          {topics?.length > 0 &&
            topics.map((topic) => (
              <Topic key={topic?._id} to={`topic/${topic?.slug}`}>
                {topic?.name}
              </Topic>
            ))}
          <p className="font-medium text-gray-600">{getTimeAgo}</p>
        </div>
      </div>
      <BlogImage
        className="flex-shrink-0"
        url={img}
        alt=""
        to={`/blog/${slug}`}
      ></BlogImage>
    </BlogStyle>
  );
};

export default Blog;
