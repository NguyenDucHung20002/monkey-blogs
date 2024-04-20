/* eslint-disable no-undef */
import { useContext, useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { apiDeleteAnArticle, apiGetProfileArticles } from "../../api/api";
import ProfileBlogs from "./ProfileBlogs";
import { NavbarHome } from "../../components/navbar";
import { DesignContext } from "../../pages/DesignPage";

const ProfileHome = () => {
  const token = localStorage.getItem("token");
  const [blogs, setBlogs] = useState([]);
  const { username } = useParams();
  const { user } = useOutletContext();
  const { showFollowRecommend } = useContext(DesignContext);
  const navProfile = [
    {
      title: "Home",
      url: `/profile/${username}`,
    },
    {
      title: "Follower",
      url: `/profile/follower/${username}`,
    },
    {
      title: "Following",
      url: `/profile/following/${username}`,
    },
  ];

  const navMyProfile = [
    {
      title: "Home",
      url: `/profile/${username}`,
    },
    {
      title: "Follower",
      url: `/profile/follower/${username}`,
    },
    {
      title: "Following",
      url: `/profile/following/${username}`,
    },
    {
      title: "Reading List",
      url: `/profile/reading-list/${username}`,
    },
  ];
  if (!showFollowRecommend?.about) {
    navProfile.push({
      title: "About",
      url: `/profile/about/${username}`,
    });
    navMyProfile.push({
      title: "About",
      url: `/profile/about/${username}`,
    });
  }
  async function fetchUserBlog() {
    const response = await apiGetProfileArticles(token, username);
    setBlogs([...response.articles]);
  }

  async function fetchDeleteArticle(id) {
    const response = await apiDeleteAnArticle(token, id);
    if (response) {
      fetchUserBlog();
    }
  }

  useEffect(() => {
    fetchUserBlog();
  }, [username]);

  return (
    <>
      <NavbarHome
        data={user?.isMyProfile ? navMyProfile : navProfile}
        className="flex-1"
      />
      <ProfileBlogs
        blogs={blogs}
        user={user}
        fetchDeleteArticle={fetchDeleteArticle}
      />
    </>
  );
};

export default ProfileHome;
