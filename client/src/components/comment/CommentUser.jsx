/* eslint-disable react/prop-types */
import { useState } from "react";
import Avatar from "../../modules/user/Avatar";
import InputComment from "../input/InputComment";
import CommentUserChildren from "./CommentUserChildren";

const CommentUser = ({ img }) => {
  const [showMore, setShowMore] = useState(false);
  const [hideReplies, setHideReplies] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [value, setValue] = useState("");
  const valueContent = { value, setValue };

  return (
    <div className="py-6 border-b border-gray-300 comment-parents">
      <div className="flex items-center gap-3 info">
        <Avatar url={img} size="small"></Avatar>
        <div className="content-info">
          <h3 className="font-medium">Duc hung 1</h3>
          <div className="text-gray-400 time">About 1 hour ago</div>
        </div>
      </div>
      <div className={`mt-3 content ${!showMore && "line-clamp-3"}`}>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit.
        Exercitationem, deleniti aliquam libero nulla consectetur autem incidunt
        non eligendi, facere nihil voluptates neque. Repellendus deleniti, sequi
        optio ipsum omnis quo consectetur!
      </div>
      {!showMore && (
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
          onClick={() => setHideReplies(!hideReplies)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
            />
          </svg>
          {!hideReplies ? "2 replies" : "hide replies"}
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
            <InputComment valueContent={valueContent}></InputComment>
          )}

          {hideReplies && <CommentUserChildren img={img}></CommentUserChildren>}
        </div>
      </div>
      <div className="comment-children"></div>
    </div>
  );
};

export default CommentUser;
