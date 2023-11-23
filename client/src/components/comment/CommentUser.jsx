/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Avatar from "../../modules/user/Avatar";
import InputComment from "../input/InputComment";
import { Link } from "react-router-dom";
import { useCallback } from "react";
import axios from "axios";
import { config } from "../../utils/constants";

const CommentUser = ({ data = [], type = "parent", slug = "" }) => {
  const { _id: parentCommentId, content, author, createdAt, isAuthor } = data;
  const [commentBlog, setCommentBlog] = useState([]);
  const [lengthReplies, setLengthReplies] = useState(0);
  const commentValue = { commentBlog, setCommentBlog };
  const [showMore, setShowMore] = useState(false);
  const [hideReplies, setHideReplies] = useState(false);
  const [showReply, setShowReply] = useState(false);
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
  function getCountRespond(count) {
    if (count === 1 || count === 0) return `${count} reply`;
    return `${count} replies`;
  }

  useEffect(() => {
    setLengthReplies(commentBlog.length);
  }, [commentBlog]);

  const handleShowComment = useCallback(async () => {
    setHideReplies(!hideReplies);
    if (!hideReplies) {
      try {
        const response = await axios.get(
          `${config.SERVER_HOST}/comment/${slug}/${parentCommentId}/replies `,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data) setCommentBlog(response.data.data);
        console.log("response.data:", response.data);
      } catch (error) {
        console.log("error:", error);
      }
    }
  }, [hideReplies, parentCommentId, slug]);

  if (data.length === 0) return;
  return (
    <div
      className={`pt-6 ${type === "parent" && "border-b border-gray-200 pb-6"}`}
    >
      <Link to={`/profile/${author.username}`}>
        <div className="flex items-center gap-3 info">
          <Avatar url={author.avatar} size="small"></Avatar>
          <div className="content-info">
            <h3 className="font-medium">
              {author.fullname}
              {isAuthor && " . author"}
            </h3>
            <div className="text-gray-400 time">{getTimeAgo(startDate)}</div>
          </div>
        </div>
      </Link>
      <div className={`mt-3 content ${!showMore && "line-clamp-3"}`}>
        {content}
      </div>
      {!showMore && content.length > 300 && (
        <button
          onClick={() => setShowMore(true)}
          className="text-green-400 transition-all hover:text-green-600"
        >
          Show more
        </button>
      )}
      <div className="flex items-center justify-between py-5 text-gray-500 action">
        <button
          className="flex items-center gap-2 p-1 transition-all hover:text-black"
          onClick={handleShowComment}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
            />
          </svg>
          {!hideReplies ? getCountRespond(lengthReplies) : "hide replies"}
        </button>
        <button
          className="flex items-center gap-2 p-1 transition-all hover:text-black"
          onClick={() => setShowReply(!showReply)}
        >
          reply
        </button>
      </div>
      <div className="flex gap-3 ml-3">
        <div className="w-[2px]  bg-gray-300 rounded-lg "></div>
        <div className="flex-1 ">
          {showReply && (
            <InputComment
              parentCommentId={parentCommentId}
              slug={slug}
              commentValue={commentValue}
            ></InputComment>
          )}

          {hideReplies &&
            commentBlog &&
            commentBlog.length > 0 &&
            commentBlog.map((comment) => (
              <CommentUser
                type="child"
                data={comment}
                key={comment._id}
                slug={slug}
              ></CommentUser>
            ))}
        </div>
      </div>
      <div className="comment-children"></div>
    </div>
  );
};

export default CommentUser;
