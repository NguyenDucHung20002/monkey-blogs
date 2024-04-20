/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { apiMuteAUser } from "../api/api";
import { toast } from "react-toastify";

const ButtonMuted = ({ userId, initialMuted = false }) => {
  const [isMuted, setIsMuted] = useState(initialMuted);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (typeof initialMuted === "boolean") {
      setIsMuted(initialMuted);
    }
  }, [initialMuted]);

  const handleMute = async () => {
    const response = isMuted
      ? await apiMuteAUser("delete", token, userId)
      : await apiMuteAUser("post", token, userId);
    const toastContent = !isMuted
      ? "You will no longer see their stories"
      : "You will see their stories";
    if (response) {
      setIsMuted(!isMuted);
      toast.success(response.message, {
        pauseOnHover: false,
        delay: 150,
      });
      toast.success(toastContent, {
        pauseOnHover: false,
        delay: 250,
      });
    }
  };

  return (
    <>
      {!isMuted ? (
        <button
          className="px-4 py-1 text-blue-600 border border-blue-600 cursor-pointer rounded-2xl"
          onClick={() => handleMute()}
        >
          Mute
        </button>
      ) : (
        <button
          className="px-4 py-1 text-white bg-blue-400 cursor-pointer rounded-2xl"
          onClick={() => handleMute()}
        >
          Unmute
        </button>
      )}
    </>
  );
};

export default ButtonMuted;
