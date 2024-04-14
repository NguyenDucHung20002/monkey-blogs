/* eslint-disable react/prop-types */
import ButtonFollowingUser from "../../components/button/ButtonFollowingUser";
import Avatar from "../user/Avatar";

// eslint-disable-next-line react/prop-types
const ProfileInfo = ({ isBlocked, setShow, user }) => {
  function formatFollowers(count) {
    if (count >= 1000000000) {
      return Math.floor(count / 1000000000) + "T";
    } else if (count >= 1000000) {
      return Math.floor(count / 1000000) + "M";
    } else if (count >= 1000) {
      return Math.floor(count / 1000) + "K";
    } else {
      return count;
    }
  }

  return (
    <>
      <div className="mb-8">
        <Avatar url={user?.avatar} size="large"></Avatar>
        <p className="mt-4 mb-1 text-black font-bold">{user?.fullname}</p>
        {user?.followersCount ? (
          <p className="mb-4">
            {formatFollowers(user?.followersCount)} Followers
          </p>
        ) : (
          ""
        )}
        <p className="mb-4">{user?.bio ? user.bio : ""} </p>

        {user?.about && user.about.trim() !== "" && (
          <div>
            <p className="text-black font-bold">About me</p>
            <p className="mb-4">{user.about}</p>
          </div>
        )}

        {user.isMyProfile ? (
          <button
            className="text-green-500 duration-300 hover:text-black"
            onClick={() => setShow(true)}
          >
            Edit Profile
          </button>
        ) : !isBlocked ? (
          <div className="flex items-center">
            <ButtonFollowingUser
              userId={user.id}
              initialFollowing={user.isFollowed}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default ProfileInfo;
