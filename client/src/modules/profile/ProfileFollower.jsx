import { useEffect, useState } from "react";
import { apiGetUserFollow } from "../../api/apiNew";
import FollowingUserHandle from "../../components/following/FollowingUserHandle";
import { useParams } from "react-router-dom";

const ProfileFollower = () => {
  const [followers, setFollower] = useState([]);
  const { username } = useParams();
  useEffect(() => {
    async function fetchUserFollow() {
      const dataFollow = await apiGetUserFollow(username, "followers");
      if (!dataFollow?.success) {
        console.log("error api:", dataFollow?.message);
      }
      setFollower(dataFollow?.data);
    }
    fetchUserFollow();
  }, [username]);
  return (
    <>
      {followers.length == 0 ? (
        <h1></h1>
      ) : (
        followers.map((val, idx) => (
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
