import { useContext, useEffect, useState, useRef } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import FollowingUserHandle from "../../components/following/FollowingUserHandle";
import { apiGetUserFollow } from "../../api/apiNew";
import { NavbarHome } from "../../components/navbar";
import { DesignContext } from "../../pages/DesignPage";
import { debounce } from "lodash";

const ProfileFollowing = () => {
  const [followings, setFollowings] = useState([]);
  const { username } = useParams();
  const { user } = useOutletContext();
  const token = localStorage.getItem("token");
  const skip = useRef("");
  const windowHeight = useRef(window.innerHeight);
  const scrollY = useRef(window.scrollY);
  const documentHeight = useRef(document.documentElement.scrollHeight);
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

  const fetchUserFollow = async () => {
    const response = await apiGetUserFollow(token, username, "following", 15);
    if (response) {
      setFollowings([...response.data]);
      skip.current = response.newSkip;
    }
  };

  useEffect(() => {
    fetchUserFollow();
  }, [token]);

  useEffect(() => {
    const handleScroll = async () => {
      windowHeight.current = window.innerHeight;
      scrollY.current = window.scrollY;
      documentHeight.current = document.documentElement.scrollHeight;
      if (
        windowHeight.current + scrollY.current + 10 >= documentHeight.current &&
        skip.current
      ) {
        const response = await apiGetUserFollow(
          token,
          username,
          "following",
          15,
          skip.current
        );
        if (response) {
          const followingsClone = [...followings, ...response.data];
          setFollowings([...followingsClone]);
          skip.current = response.newSkip;
        }
      }
    };
    const debouncedScroll = debounce(handleScroll, 200);

    window.addEventListener("scroll", debouncedScroll);

    return () => {
      window.removeEventListener("scroll", debouncedScroll);
    };
  }, [followings]);

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
