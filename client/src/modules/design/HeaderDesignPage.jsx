/* eslint-disable react/prop-types */
import Logo from "../../assets/logo.png";
import {
  DesktopIcon,
  TabletIcon,
  MobileIcon,
  ArrowLeftIcon,
} from "../../assets/icon";
import Avatar from "../user/Avatar";
import { Modal } from "antd";
import { useContext, useState } from "react";
import { DesignContext } from "../../pages/DesignPage";
import { updateProfileDesign } from "../../api/apiHa";

const token = localStorage.getItem("token");

const HeaderDesignPage = ({
  selectedDevice,
  setSelectedDevice,
  image,
  onDeleteImage,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const {
    imageDisplay,
    showFollowRecommend,
    setShowFollowRecommend,
    setImageDisplay,
    user,
  } = useContext(DesignContext);
  const handleDeviceClick = (device) => {
    setSelectedDevice(device === selectedDevice ? selectedDevice : device);
  };

  const handlePublished = async () => {
    const data = {
      image,
      style: `${imageDisplay.display}  ${imageDisplay.position}`,
      show: showFollowRecommend,
    };

    const design = JSON.stringify(data);

    await updateProfileDesign(token, design);

    window.location.replace(`/profile/${user?.data?.username}`);
  };

  const handleCancelPublish = () => {
    setShowFollowRecommend({
      following: 1,
      recommend: 0,
    });
    setImageDisplay({
      display: "object-none",
      position: "object-top",
    });
    onDeleteImage(image?.filename);
    goback();
  };
  const goback = () => {
    window.history.back();
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const showModal2 = () => {
    setIsModalOpen2(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    setIsModalOpen2(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalOpen2(false);
  };

  return (
    <>
      <div className=" text-lg flex items-center justify-between px-8 py-5 shadow-md">
        <div className="flex items-center">
          <div onClick={goback} className="flex items-center">
            <ArrowLeftIcon width="40px" height="40px" />
          </div>
          <Avatar size="xs" url={Logo}></Avatar>
          <div className="text-lg mx-2"> |</div>
          <div className="">Design</div>
        </div>
        <div className="flex items-center border border-stone-300">
          <div className="flex items-center px-4 h-9">Home</div>
          <div className="flex items-center justify-between bg-stone-100 w-24 px-4 h-9 border-l">
            <DesktopIcon
              onclick={() => handleDeviceClick("desktop")}
              isActive={selectedDevice === "desktop"}
            />
            <TabletIcon
              onclick={() => handleDeviceClick("tablet")}
              isActive={selectedDevice === "tablet"}
            />
            <MobileIcon
              onclick={() => handleDeviceClick("mobile")}
              isActive={selectedDevice === "mobile"}
            />
          </div>
        </div>
        <div className="flex">
          <button
            onClick={showModal}
            className="mr-3 text-base text-blue-600 border border-blue-600 py-1 px-2 rounded-full"
          >
            Cancel
          </button>
          <button
            onClick={showModal2}
            className=" text-base bg-blue-600 text-white border border-blue-600 py-1 px-2 rounded-full"
          >
            Publish
          </button>
        </div>
        <Modal
          // title="Basic Modal"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={""}
        >
          <div className="text-center p-16">
            <h2 className="font-bold text-3xl">Cancel recent changes</h2>
            <p className="">
              All changes made in this session will be removed. Are you sure?
            </p>
            <div className="flex justify-center pt-5">
              <button
                onClick={handleCancel}
                className="mr-8  text-base text-blue-600 border border-blue-600 py-1 px-4 rounded-full"
              >
                Keep designing
              </button>
              <button
                onClick={handleCancelPublish}
                className=" text-base bg-red-500 text-white border border-blue-600 py-1 px-4 rounded-full"
              >
                Cancel changes
              </button>
            </div>
          </div>
        </Modal>
        <Modal
          // title="Basic Modal"
          open={isModalOpen2}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={""}
        >
          <div className="text-center p-16">
            <h2 className="font-bold text-3xl">Publish design</h2>
            <p className="">
              Would you like to make this design visible to your readers?
            </p>
            <div className="flex justify-center pt-5">
              <button
                onClick={handleCancel}
                className="mr-8  text-base text-blue-600 border border-blue-600 py-1 px-4 rounded-full"
              >
                Cancel
              </button>
              <button
                onClick={handlePublished}
                className=" text-base bg-blue-600 text-white border border-blue-600 py-1 px-4 rounded-full"
              >
                Publish
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default HeaderDesignPage;
