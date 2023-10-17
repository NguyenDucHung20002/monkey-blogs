/* eslint-disable react/prop-types */
import { config } from "../../utils/constants";
import { useState } from "react";
import axios from "axios";

const ButtonFollowingUser = ({ username = "", initialFollowing = false }) => {
  const [followed, setFollowed] = useState(initialFollowing);
  const token = localStorage.getItem("token");

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

  return (
    <>
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
    </>
  );
};

export default ButtonFollowingUser;
