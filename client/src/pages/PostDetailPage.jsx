/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PostImage from "../modules/post/PostImage";
import PostMeta from "../modules/post/PostMeta";
import Avatar from "../modules/user/Avatar";
import TopicList from "../modules/topic/TopicList";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageNotFound from "./PageNotFound";
import ActionComment from "../action/ActionComment";
import ActionLike from "../action/ActionLike";
import { useSocket } from "../contexts/SocketContext";
import { apiGetArticle } from "../api/api";
import { config } from "../utils/constants";
import ButtonSaveBlog from "../components/button/ButtonSaveBlog";
import ButtonActionBlogsAuthor from "../components/button/ButtonActionBlogsAuthor";

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
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBlog() {
      try {
        const response = await apiGetArticle(token, slug);
        if (!response) navigate("/*");

        setBlog(response.data);
      } catch (error) {
        console.log("error:", error);
        navigate("/*");
      }
    }
    fetchBlog();
  }, [navigate, slug, token]);

  if (!slug) return <PageNotFound></PageNotFound>;

  return (
    <PostDetailPagePageStyle>
      {blog && (
        <div className="post-header">
          {blog.banner && (
            <PostImage
              url={`${blog.banner}`}
              className="post-feature"
            ></PostImage>
          )}
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
            <div className="py-2 mt-5 border-gray-200 action border-y flex justify-between items-center">
              <div className="flex items-center gap-5 communicate">
                <ActionLike
                  likesCount={blog.likesCount}
                  username={blog?.author.username}
                  liked={blog.articleLiked}
                  blogId={blog.id}
                ></ActionLike>
                <ActionComment blogId={blog.id}></ActionComment>
              </div>
              <div className="flex items-center gap-3 ">
                <ButtonSaveBlog
                  BlogId={blog.id}
                  checkMyProfile={blog.isSaved}
                ></ButtonSaveBlog>
                <ButtonActionBlogsAuthor
                  setMuteId={() => {}}
                  blog={blog}
                ></ButtonActionBlogsAuthor>
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
