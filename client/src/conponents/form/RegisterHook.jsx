/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Controller, useController, useForm } from "react-hook-form";
import InputHook from "../input/InputHook";
import { Input, Label, Paragraph, RadioBox } from "../radioInput/RadioStyled";
import CheckboxHook from "../radioInput/CheckboxStyled";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Radio } from "antd";

const schema = yup.object({
  username: yup.string().required().min(3),
  email: yup.string().email().required(),
  password: yup.string().required().min(3),
  sex: yup.string().required(),
  job: yup.string().required(),
  term: yup.bool().oneOf([true], "Field must be checked"),
});

const RegisterHook = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(schema),
  });
  console.log("errors:", errors);

  const onSubmitHandeler = (values) => {
    console.log("values:", values);
  };

  const [value, setValue] = useState(1);
  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandeler)}
      className="max-w-[300px] mx-auto my-10"
    >
      <div className="flex flex-col gap-3">
        <label htmlFor="username" className="cursor-pointer">
          Username
        </label>
        <InputHook
          name="username"
          id="username"
          placeholder="Enter your username"
          control={control}
          type="text"
        ></InputHook>
        <p className="text-red-500">{errors.username?.message}</p>
      </div>
      <div className="flex flex-col gap-3">
        <label htmlFor="email" className="cursor-pointer">
          Email
        </label>
        <InputHook
          name="email"
          id="email"
          placeholder="Enter your email"
          control={control}
          type="email"
        ></InputHook>
        <p className="mb-2 text-sm text-red-500">{errors.email?.message}</p>
      </div>
      <div className="flex flex-col gap-3">
        <label htmlFor="password" className="cursor-pointer">
          Password
        </label>
        <InputHook
          name="password"
          id="password"
          placeholder="Enter your password"
          control={control}
          type="password"
        ></InputHook>
        <p className="mb-2 text-sm text-red-500">{errors.password?.message}</p>
      </div>
      <div className="flex items-center gap-3">
        <Controller
          name="sex"
          control={control}
          defaultValue={1}
          render={({ field }) => (
            <Radio.Group {...field}>
              <Radio value={1}>A</Radio>
              <Radio value={2}>B</Radio>
              <Radio value={3}>C</Radio>
              <Radio value={4}>D</Radio>
            </Radio.Group>
          )}
        ></Controller>
      </div>
      <p className="block mb-2 text-sm text-red-500">{errors.sex?.message}</p>
      <MySelectBox control={control} name="job" id="job">
        <option value="">Select your job</option>
        <option value="frontend">Frontend Developer</option>
        <option value="backend">Backend Developer</option>
        <option value="fullstack">Fullstack Developer</option>
      </MySelectBox>
      <p className="mb-2 text-sm text-red-500">{errors.job?.message}</p>
      <CheckboxHook
        control={control}
        text="I accept the terms and conditions"
        name="term"
        id="term"
      ></CheckboxHook>
      <p className="mb-2 text-sm text-red-500">{errors.term?.message}</p>
      <button className="w-full p-3 mt-3 text-white bg-blue-500 rounded-md">
        Submit
      </button>
    </form>
  );
};
const MySelectBox = ({ control, label, ...props }) => {
  const { field } = useController({
    control,
    defaultValue: "",
    name: props.name,
  });

  return (
    <div className="w-full my-2">
      <select
        className="w-full p-4 mb-4 transition-all bg-white border border-gray-100 rounded-lg outline-none focus:border-blue-500"
        {...field}
        {...props}
      ></select>
    </div>
  );
};

const InputRadioHook = ({ control, ...props }) => {
  const { field } = useController({
    control,
    defaultValue: "",
    name: props?.name,
  });

  return (
    <div>
      <Label>
        <Input type="radio" {...field} {...props} />
        <RadioBox></RadioBox>
        <Paragraph>{props?.text}</Paragraph>
      </Label>
    </div>
  );
};

export default RegisterHook;
