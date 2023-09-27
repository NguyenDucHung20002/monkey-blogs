/* eslint-disable no-unused-vars */
import React from "react";

const TestDropdown = () => {
  return (
    <div>
      <div className="relative w-full max-w-[400px] m-10">
        <button className="w-full px-3 py-2 text-white bg-blue-500 rounded-sm">
          selected
        </button>
        <div className="py-5 border border-gray-400 rounded-sm">
          <div className="p-3 transition-all hover:text-white hover:bg-blue-400">
            Reactjs
          </div>
          <div className="p-3 transition-all hover:bg-blue-400 hover:text-white">
            Vitejs
          </div>
          <div className="p-3 transition-all hover:bg-blue-400 hover:text-white">
            Angularjs
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDropdown;
