/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import ProfileDemo from "./ProfileDemo";
const ContentDesignPage = ({ collapsed, selectedDevice, image }) => {
  const [size, setSize] = useState({ width: "", height: "" });
  //430x900 1024x 1366
  useEffect(() => {
    if (selectedDevice === "desktop") {
      setSize({ width: "w-[100%] ", height: "h-[100%]" });
    } else if (selectedDevice === "tablet") {
      setSize({ width: "max-w-[750px] mt-4", height: "max-h-[700px]" });
    } else if (selectedDevice === "mobile") {
      setSize({ width: "max-w-[430px] mt-10", height: "max-h-[630px]" });
    }
  }, [selectedDevice]);
  return (
    <>
      <div
        style={{
          width: `${collapsed ? "calc(100vw - 80px)" : "calc(100vw - 200px)"}`,
        }}
        className={`px-3 absolu te top-0 bottom-0`}
      >
        <div
          className={`${size.width} ${size.height} border shadow-xl overflow-auto m-auto `}
        >
          <div className="">
            <ProfileDemo selectedDevice={selectedDevice} image={image} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ContentDesignPage;
