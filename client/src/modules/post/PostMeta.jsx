/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import styled from "styled-components";
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

const PostMeta = ({ date = "", authorName = "", className = "", to = "" }) => {
  const dateCreated = new Date(date);
  return (
    <PostMetaStyles className={`post-meta ${className}`}>
      <Link to={`/profile/${to}`}>
        <span className="post-author">{authorName}</span>
      </Link>
      <div className="follow">
        <span className="post-time">{getTimeAgo(dateCreated)}</span>
        <span className="post-dot"></span>
        <button className="text-base text-green-600 cursor-pointer hover:text-green-700">
          Follow
        </button>
      </div>
    </PostMetaStyles>
  );
};

export default PostMeta;
