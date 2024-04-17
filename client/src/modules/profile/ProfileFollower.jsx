import { useContext, useEffect, useState } from "react";
import { apiGetUserFollow } from "../../api/apiNew";
import FollowingUserHandle from "../../components/following/FollowingUserHandle";
import { useOutletContext, useParams } from "react-router-dom";
import { NavbarHome } from "../../components/navbar";
import { DesignContext } from "../../pages/DesignPage";

const ProfileFollower = () => {
  const token = localStorage.getItem("token");
  const [followers, setFollower] = useState([]);
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

  useEffect(() => {
    async function fetchUserFollow() {
      const response = await apiGetUserFollow(token, username, "followers");
      if (response) {
        setFollower(response?.data);
      }
    }
    fetchUserFollow();
  }, [username]);

  return (
    <>
      <NavbarHome
        data={user?.isMyProfile ? navMyProfile : navProfile}
        className="flex-1"
      />
      {followers?.length == 0 ? (
        <h1></h1>
      ) : (
        followers?.map((val, idx) => (
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

export default ProfileFollower;
