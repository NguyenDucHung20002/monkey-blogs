import { useContext, useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import FollowingUserHandle from "../../components/following/FollowingUserHandle";
import { apiGetUserFollow } from "../../api/apiNew";
import { NavbarHome } from "../../components/navbar";
import { DesignContext } from "../../pages/DesignPage";

const ProfileFollowing = () => {
  const [followings, setFollowings] = useState([]);
  const { username } = useParams();
  const { user } = useOutletContext();
  const token = localStorage.getItem("token");

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

  async function fetchUserFollow() {
    const dataFollow = await apiGetUserFollow(token, username, "following");
    if (!dataFollow?.success) {
      return;
    }
    setFollowings(dataFollow?.data);
  }
  useEffect(() => {
    fetchUserFollow();
  }, []);
  return (
    <>
      <NavbarHome
        data={user?.isMyProfile ? navMyProfile : navProfile}
        className="flex-1"
      />
      {followings?.length == 0 ? (
        <h1></h1>
      ) : (
        followings?.map((val, idx) => (
          <FollowingUserHandle
            key={idx}
            data={val}
            initialFollowing={val?.isFollowed}
          />
        ))
      )}
    </>
  );
};

export default ProfileFollowing;
