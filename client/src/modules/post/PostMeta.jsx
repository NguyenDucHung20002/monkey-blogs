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

const PostMeta = ({
  date = "Mar 23",
  authorName = "Andiez Le",
  className = "",
  to = "",
}) => {
  return (
    <PostMetaStyles className={`post-meta ${className}`}>
      <Link to={`/author/${to}`}>
        <span className="post-author">{authorName}</span>
      </Link>
      <div className="follow">
        <span className="post-time">{date}</span>
        <span className="post-dot"></span>
        <button className="text-base text-green-600 cursor-pointer hover:text-green-700">
          Follow
        </button>
      </div>
    </PostMetaStyles>
  );
};

export default PostMeta;
