/* eslint-disable react/prop-types */
import { config } from "../../utils/constants";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ButtonFollowingUser = ({ username = "", initialFollowing = false }) => {
  const [followed, setFollowed] = useState(initialFollowing);
  const token = localStorage.getItem("token");

  const handleFollow = async () => {
    const res = await axios
      .post(
        `${config.SERVER_HOST}/follow-user/${username}/follow-unfollow`,
        {},
        {
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .catch((err) => {
        if (err.response.status == 404) {
          toast.error("Can not find user!", {
            pauseOnHover: false,
            delay: 500,
          });
        } else {
          toast.error("User banned!", {
            pauseOnHover: false,
            delay: 500,
          });
        }
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
