/* eslint-disable react/prop-types */
import Avatar from "../../modules/user/Avatar";
import img from "../../assets/logo.jpg";
import { useState } from "react";
import CommentUser from "./CommentUser";
import InputComment from "../input/InputComment";
import { useEffect } from "react";
import axios from "axios";
import { config } from "../../utils/constants";

const Comment = ({ slug = "" }) => {
  const token = localStorage.getItem("token");
  const [commentBlog, setCommentBlog] = useState([]);
  const commentValue = { commentBlog, setCommentBlog };
  useEffect(() => {
    async function fetchCommentBlog() {
      try {
        const response = await axios.get(
          `${config.SERVER_HOST}:${config.SERVER_PORT}/api/comment/${slug} `,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data) setCommentBlog(response.data.data);
      } catch (error) {
        console.log("error:", error);
      }
    }
    fetchCommentBlog();
  }, [slug, token]);

  if (!slug) return;
  if (!token) return;
  return (
    <>
      <div className="p-3 mb-5 shadow-lg ">
        <div className="flex items-center gap-4 mb-4 info">
          <Avatar url={img} size="small"></Avatar>
          <p>Duc hung</p>
        </div>
        <InputComment
          setCommentBlog={setCommentBlog}
          slug={slug}
          commentValue={commentValue}
        ></InputComment>
      </div>
      {commentBlog &&
        commentBlog.length > 0 &&
        commentBlog.map((comment) => (
          <CommentUser
            type="parent"
            img={img}
            data={comment}
            key={comment._id}
            slug={slug}
          ></CommentUser>
        ))}
    </>
  );
};

export default Comment;
