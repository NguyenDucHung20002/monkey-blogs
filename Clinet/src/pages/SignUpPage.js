import React, { useEffect, useState } from "react";
import { Label } from "../components/label";
import { Input } from "../components/input";
import { useForm } from "react-hook-form";
import { Field } from "../components/field";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IconEyeClose, IconEyeOpen } from "../components/icon";
import { Button } from "../components/button";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import AuthenticationPage from "./AuthenticationPage";

const inputData = [
  {
    id: "fullName",
    type: "text",
    name: "FullName",
  },
  {
    id: "email",
    type: "email",
    name: "Email Address",
  },
];

const schema = yup.object({
  fullName: yup.string().required("Please enter your fullName!"),
  email: yup.string().email().required("Please enter your email!"),
  password: yup.string().min(8).required("Please enter your password!"),
});

const SignUpPage = () => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const handleSignUp = async (value) => {
    try {
      if (!isValid) return;

      toast.success("Register successfully!!!", {
        pauseOnHover: false,
      });
      navigate("/");
    } catch (error) {
      if (error.code === "auth/email-already-in-use")
        toast.error("Email already existed!", {
          pauseOnHover: false,
        });
    }
  };

  const [togglePassword, setTogglePassword] = useState(false);
  useEffect(() => {
    document.title = "Register Page";
  }, []);
  useEffect(() => {
    const arrErrors = Object.values(errors);
    if (arrErrors?.length > 0) {
      toast.error(arrErrors[0].message, {
        pauseOnHover: false,
      });
    }
  }, [errors]);

  return (
    <AuthenticationPage>
      <form className="form" onSubmit={handleSubmit(handleSignUp)}>
        {inputData?.length > 0 &&
          inputData.map((val) => (
            <Field key={val.id}>
              <Label htmlFor={val.id} className="label">
                {val.name}
              </Label>
              <Input
                id={val.id}
                name={val.id}
                type={val.type}
                className="input"
                placeholder={`Enter your ${val.id}`}
                control={control}
              >
                {val.hasIcon}
              </Input>
            </Field>
          ))}
        <Field>
          <Label htmlFor="password" className="label">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type={togglePassword ? "text" : "password"}
            className="input"
            placeholder="Enter your password"
            control={control}
          >
            {!togglePassword ? (
              <IconEyeClose
                onClick={() => setTogglePassword(true)}
              ></IconEyeClose>
            ) : (
              <IconEyeOpen
                onClick={() => setTogglePassword(false)}
              ></IconEyeOpen>
            )}
          </Input>
        </Field>
        <div className="have-account">
          You're already have an account?{" "}
          <NavLink to={"/sign-in"}>Login</NavLink>
        </div>
        <Button
          type="submit"
          kind="primary"
          style={{
            width: "100%",
            maxWidth: 300,
            margin: "0 auto",
          }}
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Sign Up
        </Button>
      </form>
    </AuthenticationPage>
  );
};

export default SignUpPage;
