import { useContext } from "react";
import { NavbarHome } from "../../components/navbar";
import { DesignContext } from "../../pages/DesignPage";
import { useOutletContext, useParams } from "react-router-dom";

const About = () => {
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
  return (
    <>
      <NavbarHome
        data={user?.isMyProfile ? navMyProfile : navProfile}
        className="flex-1"
      />

      <div>
        <p className="mt-5">{user.about}</p>
      </div>
    </>
  );
};

export default About;
