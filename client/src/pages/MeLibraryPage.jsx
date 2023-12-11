import React from "react";
import { NavbarHome } from "../components/navbar";
import { Button } from "../components/button";

const MeLibraryPage = () => {
  const navLibrary = [
    {
      title: "Your Lists",
      url: "/me/library",
    },
  ];
  return (
    <div className="w-full">
      <div className="my-5 flex items-center justify-between">
        <h1 className="text-4xl font-bold">Your Library</h1>
        {/* <Button to={"/write"} height="40px">
          Write a story
        </Button> */}
      </div>
      <NavbarHome data={navLibrary} className="flex-1 mt-9 "></NavbarHome>
    </div>
  );
};

export default MeLibraryPage;
