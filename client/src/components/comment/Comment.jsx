import Avatar from "../../modules/user/Avatar";
import img from "../../assets/logo.jpg";
import { useState } from "react";
import CommentUser from "./CommentUser";
import InputComment from "../input/InputComment";

const Comment = () => {
  const [value, setValue] = useState("");
  const valueContent = { value, setValue };

  return (
    <>
      <div className="p-3 mb-5 shadow-lg">
        <div className="flex items-center gap-4 mb-4 info">
          <Avatar url={img} size="small"></Avatar>
          <p>Duc hung</p>
        </div>
        <InputComment valueContent={valueContent}></InputComment>
      </div>
      <CommentUser img={img}></CommentUser>
      <CommentUser img={img}></CommentUser>
    </>
  );
};

export default Comment;
