/* eslint-disable react/prop-types */
import { useState } from "react";
import Topic from "../../modules/topic/Topic";
import { config } from "../../utils/constants";
import axios from "axios";

const TopicUserHandle = ({ data = {} }) => {
  const { slug, name } = data;
  const token = localStorage.getItem("token");
  const [followed, setFollowed] = useState(false);

  const handleFollow = async (slug) => {
    const res = await axios
      .post(
        `${config.SERVER_HOST}:${config.SERVER_PORT}/api/follow-topic/follow-unfollow/${slug}`,
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
        <div className="py-2 pr-5 ">
          <Topic to={slug} className="mb-3 mr-3">
            {name}
          </Topic>
          <div className="flex items-center gap-2 font-semibold text-gray-500">
            <p>138 Stories</p> <div className="text-2xl -translate-y-1">.</div>{" "}
            <p>113Writers</p>
          </div>
        </div>
      </div>
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
    </div>
  );
};

export default TopicUserHandle;
