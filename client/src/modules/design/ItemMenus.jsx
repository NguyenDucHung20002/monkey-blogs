/* eslint-disable react/prop-types */
import { Radio, Select } from "antd";
import { ImageIcon, UploadIcon } from "../../assets/icon";
import { useContext } from "react";
import { DesignContext } from "../../pages/DesignPage";

export const ImageItem = ({ showModal, image }) => {
  const { imageDisplay, setImageDisplay } = useContext(DesignContext);
  const handleChange = (value) => {
    setImageDisplay({ ...imageDisplay, ["display"]: value });
  };
  const handleChangePosition = (value) => {
    setImageDisplay({ ...imageDisplay, ["position"]: value });
  };
  const optionDisplays = [
    {
      value: "object-none",
      label: "Auto",
    },
    {
      value: "object-fill",
      label: "Fill",
    },
    {
      value: "object-contain",
      label: "Fit",
    },
    {
      value: "object-cover",
      label: "Cover",
    },
  ];
  const optionRadios = [
    {
      label: "Top",
      value: "object-top",
    },
    {
      label: "Center",
      value: "object-center",
    },
    {
      label: "bottom",
      value: "object-bottom",
    },
  ];
  return (
    <div className="">
      <h4 className="text-base mb-3 text-black">Image</h4>
      <div className="text-xs p-2 flex justify-between bg-white border rounded-md items-center ">
        <div className=" w-[14px] h-[14px]">
          {image ? (
            <img className=" w-[14px] h-[14px]" src={image?.url} />
          ) : (
            <ImageIcon />
          )}
        </div>
        <span className="">IMAGE</span>
        <div className="flex cursor-pointer items-center" onClick={showModal}>
          {image ? (
            <span className="text-red-300">Remove</span>
          ) : (
            <>
              <UploadIcon />
              <span className=" ml-1 text-cyan-700">Add</span>
            </>
          )}
        </div>
      </div>
      {image ? (
        <>
          <div className="flex items-center justify-between">
            <p className="mr-2">Select display</p>
            <Select
              className="flex-1"
              defaultValue="Auto"
              placeholder="Select"
              onChange={handleChange}
              options={optionDisplays}
            />
          </div>
          <div className="flex items-center justify-between">
            <h4>Position</h4>
            <Select
              className=" ml-2 flex-1"
              defaultValue={"Top"}
              options={optionRadios}
              onChange={handleChangePosition}
            />
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export const NavigationItem = () => {
  const { showFollRecmt, setShowFollRecmt } = useContext(DesignContext);
  const handleChangeFollowing = (e) => {
    setShowFollRecmt({ ...showFollRecmt, ["following"]: e.target.value });
  };
  const handleChangeRecmt = (e) => {
    setShowFollRecmt({ ...showFollRecmt, ["recomment"]: e.target.value });
  };
  return (
    <>
      <div className="">
        <h4 className="text-base text-black">Follow</h4>
        <Radio.Group onChange={handleChangeFollowing} defaultValue={1}>
          <Radio value={0}>Off</Radio>
          <Radio value={1}>On</Radio>
        </Radio.Group>
        <h4 className="text-base text-black">Topic</h4>
        <Radio.Group onChange={handleChangeRecmt} defaultValue={0}>
          <Radio value={0}>Off</Radio>
          <Radio value={1}>On</Radio>
        </Radio.Group>
      </div>
    </>
  );
};
