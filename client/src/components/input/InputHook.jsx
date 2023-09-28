/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React from "react";
import { useController } from "react-hook-form";

const InputHook = ({ control, ...props }) => {
  const { field } = useController({
    control,
    name: props.name,
    defaultValue: "",
  });
  return (
    <div>
      <input
        className=" p-4 border outline-none border-gray-100 rounded-lg bg-white 
          transition-all focus:border-blue-500 w-full"
        {...field}
        {...props}
      />
    </div>
  );
};

export default InputHook;
