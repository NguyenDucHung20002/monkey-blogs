import React, { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { NavbarHome } from "../../components/navbar";
import { apiDeleteArticle, apiGetUserBlogs } from "../../api/api";
import ProfileBlogs from "./ProfileBlogs";


const ProfileHome =()=>{
  const [blogs, setBlogs] = useState([]);
  const { username } = useParams();
  const data = useOutletContext()
  const user=data?.user
  //fetch list blogs of user
  async function fetchUserBlog() {
    const dataBlogs = await apiGetUserBlogs(username);
    // console.log(dataBlogs);
    setBlogs([...dataBlogs]);
  }
  //fetch btn delete article
  async function fetchDeleteArticle(slug) {
    const delArticle = await apiDeleteArticle(token, slug);
    if (delArticle) {
      fetchUserBlog();
    }
  }
  useEffect(()=>{
    fetchUserBlog()
  },[])
  return (<>
      <ProfileBlogs
        blogs={blogs}
        user={user}
        fetchDeleteArticle={fetchDeleteArticle}
      />
  </>)
}

export default ProfileHome;