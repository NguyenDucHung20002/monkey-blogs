import { useEffect, useState } from "react";
import UpdateProfile from "../components/form/UpdateProfile";
import ProfileInfor from "../modules/profile/ProfileInfor";
import ProfileContext from "../modules/profile/ProfileContext";
import TopicRcmm from "../modules/topic/TopicRcm";
import { useParams } from "react-router-dom";
import ProfileBlogs from "../modules/profile/ProfileBlogs";
import Following from "../components/follow/Following";
import { apiDeleteArticle, apiGetProfile, apiGetUserBlogs, apiGetUserFollowings } from "../api/api";

const ProfilePage = () => {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({});
  const [blogs, setBlogs] = useState([]);
  const [following, setFollowing] = useState([]);
  const { username } = useParams();
  const token = localStorage.getItem("token");
  //fetch information user
  async function fetchUserInf() {
    const profileUser = await apiGetProfile(token, username);
    setUser({ ...profileUser });
  }
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
  //fetch list user following
  async function fetchUserFollowing() {
    const dataFollowings = await apiGetUserFollowings(username);
    setFollowing([...dataFollowings]);
  }

  useEffect(() => {
    fetchUserInf();
  }, [show, username]);
  useEffect(() => {
    fetchUserBlog();
    fetchUserFollowing();
  }, [username]);
  return (
    <>
      <div className="w-full border-t border-gray-300"></div>
      {user.isMyProfile && <UpdateProfile user={user} show={show} setShow={setShow} />}
      <div className="container max-w-[1336px] mx-auto flex">
        <div className="w-full md:px-14 md:max-w-[70%] ">
          <ProfileContext token={token} user={user} />
          <ProfileBlogs
            blogs={blogs}
            user={user}
            fetchDeleteArticle={fetchDeleteArticle}
          />
        </div>
        <div className="  max-w-[30%] md:block  ">
          <div className="w-full h-screen p-8 text-gray-500 border-l border-l-gray-300 ">
            {user.id &&             
            <ProfileInfor
              show={show}
              setShow={setShow}
              user={user}
            />}

            <Following
              data={following}
              token={token}
              user={user}
            />
            <TopicRcmm />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;

