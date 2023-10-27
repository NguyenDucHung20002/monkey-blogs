/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PostImage from "../modules/post/PostImage";
import img from "../assets/logo.jpg";
import PostMeta from "../modules/post/PostMeta";
import Avatar from "../modules/user/Avatar";
import TopicList from "../modules/topic/TopicList";
import { Link, useParams } from "react-router-dom";
import { config } from "../utils/constants";
import axios from "axios";
import { toast } from "react-toastify";
import PageNotFound from "./PageNotFound";
import ActionComment from "../action/ActionComment";
import ActionLike from "../action/ActionLike";

const PostDetailPagePageStyle = styled.div`
  padding: 50px 0;
  max-width: 700px;
  width: 100%;
  margin: 0 auto;
  .post {
    &-header {
      width: 100%;
    }
    &-heading {
      font-weight: bold;
      font-size: 36px;
    }

    &-content {
      max-width: 700px;
      margin: 40px auto;
    }
  }
  .author {
    margin-top: 40px;
    margin-bottom: 80px;
    display: flex;
    border-radius: 20px;
    background-color: ${(props) => props.theme.grayF3};
    &-image {
      width: 200px;
      height: 200px;
      flex-shrink: 0;
      border-radius: inherit;
    }
    &-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: inherit;
    }
    &-content {
      flex: 1;
      padding: 20px;
    }
    &-name {
      font-weight: bold;
      margin-bottom: 10px;
      font-size: 20px;
    }
    &-desc {
      font-size: 14px;
      line-height: 2;
    }
  }
  @media screen and (max-width: 1023.98px) {
    padding-bottom: 40px;
    .post {
      &-heading {
        font-size: 26px;
      }
      &-content {
        margin: 40px 0;
      }
    }
    .author {
      flex-direction: column;
      &-image {
        width: 100%;
        height: auto;
      }
    }
  }
`;

const PostDetailPage = () => {
  const { slug } = useParams("slug");
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const response = await axios.get(
          `${config.SERVER_HOST}:${config.SERVER_PORT}/api/article/${slug} `,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data) setBlog(response.data.data);
      } catch (error) {
        toast.error("Some thing was wrong!", {
          pauseOnHover: false,
          delay: 500,
        });
      }
    }
    fetchBlog();
  }, [slug]);

  if (!slug) return <PageNotFound></PageNotFound>;

  return (
    <PostDetailPagePageStyle>
      {blog && (
        <div className="post-header">
          <PostImage url={blog.img} className="post-feature"></PostImage>
          <div className="post-info">
            <h1 className="py-10 post-heading">{blog?.title}</h1>
            <div className="flex items-center gap-5 mb-5">
              <Link to={`/profile/${blog.author?.username}`}>
                <Avatar url={blog.author?.avatar} size="large"></Avatar>
              </Link>
              <PostMeta
                date={blog.createdAt}
                authorName={blog.author?.fullname}
                to={blog.author?.username}
              ></PostMeta>
            </div>
            <TopicList data={blog.topics}></TopicList>
            <div className="py-2 mt-5 border-gray-200 action border-y">
              <div className="flex items-center gap-5 communicate">
                <ActionLike></ActionLike>
                <ActionComment slug={blog.slug}></ActionComment>
              </div>
            </div>
          </div>
          <div className="post-content">
            <div
              className="entry-content"
              // Prevent XSS Attack recommen from React Docs
              dangerouslySetInnerHTML={{
                __html: blog.content || "",
              }}
            ></div>
          </div>
        </div>
      )}
    </PostDetailPagePageStyle>
  );
};

export default PostDetailPage;
