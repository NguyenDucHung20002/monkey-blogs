/* eslint-disable no-unused-vars */
import React from "react";
import styled from "styled-components";
import PostImage from "../modules/post/PostImage";
import img from "../assets/logo.jpg";
import PostMeta from "../modules/post/PostMeta";
import Avatar from "../modules/user/Avatar";
import TopicList from "../modules/topic/TopicList";

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
      margin: 80px auto;
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
const topics = [
  {
    name: "Hentai",
    slug: "hentai",
  },
  {
    name: "Echi",
    slug: "echi",
  },
];

const PostDetailPage = () => {
  return (
    <PostDetailPagePageStyle>
      <div className="post-header">
        <PostImage url={img} className="post-feature"></PostImage>
        <div className="post-info">
          <h1 className="py-10 post-heading">Hentai</h1>
          <div className="flex items-center gap-5 mb-5">
            <Avatar url={img} size="large"></Avatar>
            <PostMeta></PostMeta>
          </div>
          <TopicList data={topics}></TopicList>
          {/* Check if user role is ADMIN then can edit the post */}
          {/* {userInfo?.role === userRole.ADMIN && (
                <Link
                  to={`/manage/update-post?id=${postInfo.id}`}
                  className="inline-block px-4 py-2 mt-5 text-sm border border-gray-400 rounded-md"
                >
                  Edit post
                </Link>
              )} */}
        </div>
        <div className="post-content">
          <div
            className="entry-content"
            // Prevent XSS Attack recommen from React Docs
          >
            <h2>hentai</h2>
          </div>
          {/* <AuthorBox userId={user.id}></AuthorBox> */}
        </div>
        {/* <PostRelated categoryId={postInfo?.category?.id}></PostRelated> */}
      </div>
    </PostDetailPagePageStyle>
  );
};

export default PostDetailPage;
