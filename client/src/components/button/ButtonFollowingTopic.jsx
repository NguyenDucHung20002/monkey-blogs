/* eslint-disable react/prop-types */
import { useState } from "react";
import apiFollowTopic from "../../api/apiFollowTopic";

const ButtonFollowingTopic = ({ initialFollowing = false, slug = "" }) => {
  const [followed, setFollowed] = useState(initialFollowing);
  const token = localStorage.getItem("token");

  const handleFollow = async (slug) => {
    const res = await apiFollowTopic(slug, token);
    if (res) {
      setFollowed(!followed);
    }
  };
  if (!slug) return;
  return (
    <>
      {!followed ? (
        <button
          className="px-4 py-1 text-blue-600 border border-blue-600 cursor-pointer rounded-2xl"
          onClick={() => handleFollow(slug)}
        >
          Follow
        </button>
      ) : (
        <button
          className="px-4 py-1 text-white bg-blue-400 cursor-pointer rounded-2xl"
          onClick={() => handleFollow(slug)}
        >
          Following
        </button>
      )}
    </>
  );
};

export default ButtonFollowingTopic;
