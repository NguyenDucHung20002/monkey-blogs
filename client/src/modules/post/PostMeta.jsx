/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import styled from "styled-components";
import useTimeAgo from "../../hooks/useTimeAgo";
import { apiFollowUser, apiUnFollowUser } from "../../api/api";
import { useEffect, useState } from "react";
const PostMetaStyles = styled.div`
  color: inherit;
  font-size: 14px;
  font-weight: 600;
  .follow {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .post {
    &-dot {
      display: inline-block;
      width: 4px;
      height: 4px;
      background-color: currentColor;
      border-radius: 100rem;
    }
  }
  @media screen and (max-width: 1023.98px) {
    font-size: 10px;
    gap: 6px;
  }
`;

const PostMeta = ({ blog, className }) => {
  const getTimeAgo = useTimeAgo(blog.updatedAt);
  const token = localStorage.getItem("token");
  const [isFollowed, setIsFollowed] = useState(false);

  useEffect(() => {
    if (blog && typeof blog.authorFollowed === "boolean")
      setIsFollowed(blog.authorFollowed);
  }, [blog]);

  const handleFollow = async () => {
    const res = isFollowed
      ? await apiUnFollowUser(blog.author.id, token)
      : await apiFollowUser(blog.author.id, token);
    if (res) {
      setIsFollowed(!isFollowed);
    }
  };
  return (
    <PostMetaStyles className={`post-meta ${className}`}>
      <Link to={`/profile/${blog.author.userInfo.username}`}>
        <span className="post-author">{blog.author.fullname}</span>
      </Link>
      <div className="follow">
        <span className="post-time">{getTimeAgo}</span>
        <span className="post-dot"></span>
        <button
          className="text-base text-green-600 cursor-pointer hover:text-green-700"
          onClick={handleFollow}
        >
          {isFollowed ? "Following" : "Follow"}
        </button>
      </div>
    </PostMetaStyles>
  );
};

export default PostMeta;
