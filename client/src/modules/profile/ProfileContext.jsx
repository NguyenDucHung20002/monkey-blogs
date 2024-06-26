/* eslint-disable react/prop-types */
import { Button, Modal, Popover } from "antd";
import { useEffect, useState } from "react";
import { apiBlockAUser, apiMuteAUser, apiReportAUser } from "../../api/api";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const More = ({
  handleMute,
  isMuted,
  handleBlock,
  isBlock,
  handleCopyToClipboard,
  showModal,
}) => {
  return (
    <>
      <div className=" text-stone-500">
        <div
          onClick={handleCopyToClipboard}
          className="p-1 cursor-pointer hover:text-black"
        >
          Copy link to profile
        </div>
        <div
          onClick={handleMute}
          className="p-1 cursor-pointer hover:text-black"
        >
          {isMuted ? "Unmute" : "Mute"} this author
        </div>
        <div
          onClick={handleBlock}
          className="p-1 cursor-pointer hover:text-black"
        >
          {isBlock ? "Unblock" : "Block"} this author
        </div>
        <div
          onClick={showModal}
          className="p-1 cursor-pointer hover:text-black"
        >
          Report this author
        </div>
      </div>
    </>
  );
};

const MoreMe = ({ user, handleCopyToClipboard }) => {
  return (
    <>
      <div className=" text-stone-500">
        <div
          onClick={handleCopyToClipboard}
          className="p-1 cursor-pointer hover:text-black"
        >
          Copy link to profile
        </div>
        <div className="cursor-pointer p-1 hover:text-black">
          <Link to={`/me/design/${user.username}`}>Design your profile</Link>
        </div>
      </div>
    </>
  );
};

const ProfileContext = ({ setIsBlocked, isBlocked, user, token }) => {
  const [isMuted, setMuted] = useState(false);
  const [isBlock, setBlock] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMuted(user?.isMuted);
    setBlock(user?.isBlocked);
  }, [user]);

  const handleCopyToClipboard = async () => {
    try {
      const url = window.location.href;
      const currentURL = `${url}profile/${user?.username}`;
      await navigator.clipboard.writeText(currentURL);
      toast.success("Copy to ClipBoard successfully!", {
        pauseOnHover: false,
        delay: 100,
      });
    } catch (error) {
      console.error("error when add clipboard:");
    }
  };

  const handleMute = async () => {
    const type = isMuted ? "delete" : "post";
    const toastContent = !isMuted
      ? "You will no longer see their stories"
      : "You will see their stories";
    const response = await apiMuteAUser(type, token, user.id);
    if (response) {
      setMuted(!isMuted);
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

  const handleBlock = async () => {
    const type = isBlock ? "delete" : "post";
    const response = await apiBlockAUser(type, token, user.id);
    if (response) {
      setBlock(!isBlock);
      setIsBlocked(!isBlock);
      toast.success(response.message, {
        pauseOnHover: false,
        delay: 150,
      });
    }
  };

  const schema = yup.object({
    reason: yup.string().required().max(80).min(3),
    description: yup.string().max(250),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const handleOpenChange = (newOpen) => {
    setOpenPopover(newOpen);
  };

  const showModal = () => {
    setIsModalOpen(true);
    setOpenPopover(false);
  };

  const handleOk = async (values) => {
    setLoading(true);
    const reason = values.reason;
    const description = values.description;
    const response = await apiReportAUser(token, user.id, reason, description);
    if (response) {
      toast.success(response.message, {
        pauseOnHover: false,
        delay: 150,
      });
    }
    setValue("reason", "");
    setValue("description", "");
    setIsModalOpen(false);
    setLoading(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const btnModal = [
    <Button key="back" className="rounded-3xl" onClick={handleCancel}>
      Cancel
    </Button>,
    <Button
      key="submit"
      danger
      className="rounded-3xl"
      loading={loading}
      onClick={handleSubmit(handleOk)}
    >
      Report
    </Button>,
  ];

  return (
    <>
      <div className="w-full py-8">
        <div className="flex items-center justify-between w-full h-20 py-4">
          <div className="text-[25px] text-black py-3 font-bold">
            {user.fullname}
            {isBlocked ? " has been blocked" : ""}
          </div>
          <div className="">
            <Popover
              trigger={"click"}
              open={openPopover}
              onOpenChange={handleOpenChange}
              content={
                user?.isMyProfile ? (
                  <MoreMe
                    user={user}
                    handleCopyToClipboard={handleCopyToClipboard}
                  />
                ) : (
                  <More
                    showModal={showModal}
                    handleMute={handleMute}
                    isMuted={isMuted}
                    isBlock={isBlock}
                    handleBlock={handleBlock}
                    handleCopyToClipboard={handleCopyToClipboard}
                  />
                )
              }
              placement="bottom"
            >
              <button className="" onClick={() => setOpenPopover(!openPopover)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.39 12c0 .55.2 1.02.59 1.41.39.4.86.59 1.4.59.56 0 1.03-.2 1.42-.59.4-.39.59-.86.59-1.41 0-.55-.2-1.02-.6-1.41A1.93 1.93 0 0 0 6.4 10c-.55 0-1.02.2-1.41.59-.4.39-.6.86-.6 1.41zM10 12c0 .55.2 1.02.58 1.41.4.4.87.59 1.42.59.54 0 1.02-.2 1.4-.59.4-.39.6-.86.6-1.41 0-.55-.2-1.02-.6-1.41a1.93 1.93 0 0 0-1.4-.59c-.55 0-1.04.2-1.42.59-.4.39-.58.86-.58 1.41zm5.6 0c0 .55.2 1.02.57 1.41.4.4.88.59 1.43.59.57 0 1.04-.2 1.43-.59.39-.39.57-.86.57-1.41 0-.55-.2-1.02-.57-1.41A1.93 1.93 0 0 0 17.6 10c-.55 0-1.04.2-1.43.59-.38.39-.57.86-.57 1.41z"
                    fill="currentColor"
                  ></path>
                </svg>
              </button>
            </Popover>
          </div>
          <Modal
            footer={btnModal}
            title={"Report this user?"}
            open={isModalOpen}
            onCancel={handleCancel}
          >
            <div className="py-2">
              <label htmlFor="input-reason">Reason*:</label>
              <input
                className="w-full border-b border-black "
                type="text"
                id="input-reason"
                {...register("reason")}
              />
              <div className="input-bottom">
                <p className={errors.reason ? "text-red-500" : ""}>
                  {errors.reason ? errors.reason?.message : ""}
                </p>
              </div>
            </div>
            <div className="py-2">
              <label htmlFor="input-description">Description:</label>
              <input
                className="w-full border-b border-black "
                type="text"
                id="input-description"
                {...register("description")}
              />
              <div className="input-bottom">
                <p className={errors.description ? "warning" : ""}>
                  {errors.description
                    ? errors.description?.message
                    : "can be empty, max 250 characters"}
                </p>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default ProfileContext;
