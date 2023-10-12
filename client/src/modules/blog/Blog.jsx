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

const BlogStyle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0 20px 20px;
`;

const Blog = ({ blog }) => {
  const { title, preview, img, slug, topics, author, createdAt } = blog;
  const startDate = new Date(createdAt);
  function getTimeAgo(startDate) {
    const currentDate = new Date();
    const timeDifference = currentDate - startDate;
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) {
      return `${seconds} seconds ago`;
    } else if (minutes < 60) {
      return `${minutes} ${minutes === 1 ? "min" : "mins"} ago`;
    } else if (hours < 24) {
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    }
  }

  return (
    <BlogStyle className="border-b border-gray-300">
      <div className="flex-1 pt-3 pr-5">
        <div className="flex items-center">
          <Link to={`/author/${author?.username}`}>
            <Avatar
              className="cursor-pointer"
              size="large"
              src={<img src={author.avatar} alt="avatar" />}
            />
          </Link>
          <p className="mx-1"> </p>
          <BlogMeta
            authorName={author.fullname}
            date={createdAt}
            to={author.username}
          ></BlogMeta>
        </div>
        <p className="my-2"> </p>
        <BlogTitle to={`/blog/${slug}`} size="big">
          <div className=" line-clamp-2">{title}</div>
        </BlogTitle>
        <p className="mt-2 text-base text-gray-400 line-clamp-2">{preview}</p>
        <div className="flex items-center justify-start gap-3 mt-3">
          {topics?.length > 0 &&
            topics.map((topic) => (
              <Topic key={topic._id} to={topic.slug}>
                {topic.name}
              </Topic>
            ))}
          <p className="font-medium text-gray-600">{getTimeAgo(startDate)}</p>
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
