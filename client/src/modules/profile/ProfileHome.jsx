/* eslint-disable no-undef */
import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { apiDeleteArticle, apiGetUserBlogs } from "../../api/api";
import ProfileBlogs from "./ProfileBlogs";

const ProfileHome = () => {
  const [blogs, setBlogs] = useState([]);
  console.log("blogs:", blogs);
  const { username } = useParams();
  const data = useOutletContext();
  const user = data?.user;

  async function fetchDeleteArticle(slug) {
    const delArticle = await apiDeleteArticle(token, slug);
    if (delArticle) {
      fetchUserBlog();
    }
  }
  useEffect(() => {
    async function fetchUserBlog() {
      const dataBlogs = await apiGetUserBlogs(username);
      // console.log(dataBlogs);
      setBlogs([...dataBlogs]);
    }
    fetchUserBlog();
  }, [username]);
  return (
    <>
      <ProfileBlogs
        blogs={blogs}
        user={user}
        fetchDeleteArticle={fetchDeleteArticle}
      />
    </>
  );
};

export default ProfileHome;
