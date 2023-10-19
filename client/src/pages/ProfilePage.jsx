import { useEffect, useState } from "react";
import axios from "axios";
import UpdateProfile from "../components/form/UpdateProfile";
import ProfileInfor from "../modules/profile/ProfileInfor";
import ProfileContext from "../modules/profile/ProfileContext";
import { config } from "../utils/constants";
import TopicRcmm from "../modules/topic/TopicRcm";
import { useParams } from "react-router-dom";
import ProfileBlogs from "../modules/profile/ProfileBlogs";
import Following from "../components/follow/Following";
const ProfilePage = () => {
  const [show, setShow] = useState(false);
  const [isfollowed, setIsFollowed] = useState(false);
  const [user, setUser] = useState({});
  const [blogs, setBlogs] = useState([]);
  const [following, setFollowing] = useState([]);
  const { username } = useParams();
  const token = localStorage.getItem("token");
  async function fetchUserInf() {
    const res = await axios
      .get(
        `${config.SERVER_HOST}:${config.SERVER_PORT}/api/user/${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .catch((err) => {
        console.log(err);
      });
    if (res.data.success) {
      const profileUser = res.data.data;
      setUser({ ...profileUser });
      setIsFollowed(profileUser.isMe)
    }
  }
  async function fetchUserBlog() {
    const res = await axios
      .get(`${config.SERVER_HOST}:${config.SERVER_PORT}/api/user/${username}/articles`)
      .catch((err) => {
        console.log(err);
      });
      if (res.data.success) {
        const dataBlogs = res.data.data;
        setBlogs( [...dataBlogs ]);
      }
    }
  async function fetchDeleteArticle(slug) {
    const res = await axios
      .delete(
        `${config.SERVER_HOST}:${config.SERVER_PORT}/api/article/${slug}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .catch((err) => {
        console.log(err);
      });
    if (res.data.success) {
        fetchUserBlog()
    }
  }
  async function fetchUserFollowing() {
    const res = await axios
      .get(`${config.SERVER_HOST}:${config.SERVER_PORT}/api/user/${username}/following`)
      .catch((err) => {
        console.log(err);
      });
      if (res.data.success) {
        const dataBlogs = res.data.data;
        setFollowing( [...dataBlogs ]);
      }
    }
  useEffect(() => {
    fetchUserInf();
    fetchUserBlog();
    fetchUserFollowing()
  }, [show, username]);
  console.log(user);
    return (
    <>
      <div className="w-full border-t border-gray-300"></div>
      {user.isMe && (
        <UpdateProfile user={user} show={show} setShow={setShow} />
      )}
      <div className="container max-w-[1336px] mx-auto flex">
        <div className="w-full md:px-14 md:max-w-[70%] ">
          <ProfileContext user={user} />
          <ProfileBlogs blogs={blogs} user={user} fetchDeleteArticle={fetchDeleteArticle} />
        </div>
        <div className=" hidden max-w-[30%] md:block  ">
          <div className="w-full h-screen p-8 text-gray-500 border-l border-l-gray-300 ">
            <ProfileInfor
              show={show}
              setShow={setShow}
              user={user}
              isfollowed={isfollowed}
              username={username}
            />
            <Following data={following} token={token} user={user}/>
            <TopicRcmm />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;

// const ProfilePageStyle = styled.div`
//   .container {
//     max-width: 1200px;
//     margin: auto;
//   }
// `;
