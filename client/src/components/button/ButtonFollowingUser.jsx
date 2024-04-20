/* eslint-disable react/prop-types */
import { useState } from "react";
import { apiFollowAUser, apiUnFollowAUser } from "../../api/api";

const ButtonFollowingUser = ({ userId, initialFollowing = false }) => {
  const [followed, setFollowed] = useState(initialFollowing);
  const token = localStorage.getItem("token");

  const handleFollow = async () => {
    const response = followed
      ? await apiUnFollowAUser(userId, token)
      : await apiFollowAUser(userId, token);
    if (response) {
      setFollowed(!followed);
    }
  };

  return (
    <>
      {!followed ? (
        <button
          className="px-4 py-1 text-blue-600 border border-blue-600 cursor-pointer rounded-2xl"
          onClick={() => handleFollow()}
        >
          Follow
        </button>
      ) : (
        <button
          className="px-4 py-1 text-white bg-blue-400 cursor-pointer rounded-2xl"
          onClick={() => handleFollow()}
        >
          Following
        </button>
      )}
    </>
  );
};

export default ButtonFollowingUser;
