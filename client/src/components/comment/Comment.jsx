/* eslint-disable react/prop-types */
import Avatar from "../../modules/user/Avatar";
import { useState } from "react";
import CommentUser from "./CommentUser";
import InputComment from "../input/InputComment";
import { useEffect } from "react";
import { useAuth } from "../../contexts/auth-context";
import apiGetComment from "../../api/apiGetComment";

const Comment = ({ slug = "" }) => {
  const token = localStorage.getItem("token");
  const { userInfo } = useAuth();
  const { data } = userInfo;
  console.log("userInfo:", userInfo);
  const [commentBlog, setCommentBlog] = useState([]);
  const commentValue = { commentBlog, setCommentBlog };
  useEffect(() => {
    async function fetchCommentBlog() {
      const response = await apiGetComment(slug, token);
      if (response) setCommentBlog(response.data);
    }
    fetchCommentBlog();
  }, [slug, token]);

  if (!slug) return;
  if (!token) return;
  return (
    <>
      <div className="p-3 mb-5 shadow-lg ">
        <div className="flex items-center gap-4 mb-4 info">
          <Avatar url={data.avatar} size="small"></Avatar>
          <p>{data.fullname}</p>
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
            img={data.avatar}
            data={comment}
            key={comment._id}
            slug={slug}
          ></CommentUser>
        ))}
    </>
  );
};

export default Comment;
