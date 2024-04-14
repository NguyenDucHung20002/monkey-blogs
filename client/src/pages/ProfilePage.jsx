import { useEffect, useState } from "react";
import UpdateProfile from "../components/form/UpdateProfile";
import ProfileInfo from "../modules/profile/ProfileInfo";
import ProfileContext from "../modules/profile/ProfileContext";
import { Navigate, Outlet, useParams } from "react-router-dom";
import Following from "../components/follow/Following";
import {
  apiGetProfile,
  apiGetUserFollowings,
  apiSuggestionTopics,
} from "../api/api";
import StickyBox from "react-sticky-box";
import RecommendTopic from "../modules/topic/TopicRcm";

const ProfilePage = () => {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({});
  const [following, setFollowing] = useState([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const [topics, setTopics] = useState([]);
  const { username } = useParams();
  const token = localStorage.getItem("token");
  const [design, setDesign] = useState({});

  useEffect(() => {
    async function fetchUserInf() {
      const profileUser = await apiGetProfile(token, username);
      if (!profileUser) return window.location.replace("/*");
      setUser({ ...profileUser.data });
      setIsBlocked(profileUser?.isBlocked);
      const design = JSON.parse(profileUser.data.profileDesign);
      setDesign({ ...design });
    }

    async function fetchSuggestionTopics() {
      const response = await apiSuggestionTopics(token);
      if (response) setTopics(response.data);
    }

    fetchUserInf();
    fetchSuggestionTopics();
  }, [show, token, username]);

  useEffect(() => {
    async function fetchUserFollowing() {
      const dataFollowings = await apiGetUserFollowings(username);
      setFollowing([...dataFollowings.data]);
    }
    fetchUserFollowing();
  }, [username]);

  return (
    <>
      <div className="w-full border-t border-gray-300"></div>
      {user.isMyProfile && (
        <UpdateProfile user={user} show={show} setShow={setShow} />
      )}
      <div className="container max-w-[1336px] mx-auto flex">
        <div className="w-full md:px-14 md:max-w-[70%] ">
          <div className="">
            <img
              className={`max-h-32 w-full ${design?.style} `}
              src={design?.image?.url}
              alt=""
            />
          </div>
          <ProfileContext
            isBlocked={isBlocked}
            setIsBlocked={setIsBlocked}
            token={token}
            user={user}
          />
          {!isBlocked && <Outlet context={{ user }}></Outlet>}
        </div>
        <div className="hidden flex-1 max-w-[30%] md:block  ">
          <StickyBox>
            <div className="w-full h-screen p-8 text-gray-500 border-l border-l-gray-300 ">
              {user.id && (
                <ProfileInfo
                  show={show}
                  setShow={setShow}
                  user={user}
                  isBlocked={isBlocked}
                />
              )}
              {design?.show?.following ? (
                <Following data={following} token={token} user={user} />
              ) : (
                ""
              )}
              {/* {design?.show?.recommend ? <RecommendTopic data={topics} /> : ""} */}
            </div>
          </StickyBox>
        </div>
      </div>{" "}
    </>
  );
};

export default ProfilePage;
