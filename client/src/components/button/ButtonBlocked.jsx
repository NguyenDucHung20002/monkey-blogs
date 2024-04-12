/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { apiBlockUser } from "../../api/api";
import { toast } from "react-toastify";

const ButtonBlocked = ({ userId, initialBlock = false }) => {
  const [isBlocked, setIsBlock] = useState(initialBlock);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (typeof initialBlock === "boolean") {
      setIsBlock(initialBlock);
    }
  }, [initialBlock]);

  const handleBlock = async () => {
    const response = isBlocked
      ? await apiBlockUser("delete", token, userId)
      : await apiBlockUser("post", token, userId);
    if (response) {
      setIsBlock(!isBlocked);
      toast.success(response.message, {
        pauseOnHover: false,
        delay: 150,
      });
    }
  };

  return (
    <>
      {!isBlocked ? (
        <button
          className="px-4 py-1 text-blue-600 border border-blue-600 cursor-pointer rounded-2xl"
          onClick={() => handleMute()}
        >
          Block
        </button>
      ) : (
        <button
          className="px-4 py-1 text-white bg-blue-400 cursor-pointer rounded-2xl"
          onClick={() => handleBlock()}
        >
          Unblock
        </button>
      )}
    </>
  );
};

export default ButtonBlocked;
