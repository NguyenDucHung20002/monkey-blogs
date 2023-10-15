/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import Avatar from "../../modules/user/Avatar";
import { useState } from "react";
import { config } from "../../utils/constants";
import axios from "axios";

const FollowingUserHandle = ({ data = {} }) => {
  const { username, avatar, fullname, bio } = data;
  const token = localStorage.getItem("token");
  const [followed, setFollowed] = useState(false);

  const handleFollow = async (username) => {
    const res = await axios
      .post(
        `${config.SERVER_HOST}:${config.SERVER_PORT}/api/follow-user/${username}/follow-unfollow`,
        {},
        {
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .catch((err) => {
        console.log(err);
      });
    if (res.data.success) {
      setFollowed(!followed);
    }
  };

  if (!data) return;
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center ">
        <Link to={`/profile/${username}`}>
          <Avatar className="cursor-pointer" size="medium" url={avatar} />
        </Link>
        <div className="py-5 pr-5 ml-4 ">
          <Link to={`/profile/${username}`}>
            <h3 className="text-base font-semibold">{fullname}</h3>
          </Link>
          {bio && <p className="max-w-xs text-sm line-clamp-2">{bio}</p>}
        </div>
      </div>
      {!followed ? (
        <button
          className="px-4 py-1 text-blue-600 border border-blue-600 cursor-pointer rounded-2xl"
          onClick={() => handleFollow(username)}
        >
          Follow
        </button>
      ) : (
        <button
          className="px-4 py-1 text-white bg-blue-400 cursor-pointer rounded-2xl"
          onClick={() => handleFollow(username)}
        >
          Following
        </button>
      )}
    </div>
  );
};

export default FollowingUserHandle;
