import { useForm } from "react-hook-form";
import { Button } from "../components/button";
import { NavLink } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import InputAuth from "../components/input/InputAuth";
import { Label } from "../components/label";
import { Field } from "../components/field";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiForgotPassword } from "../api/apisHung";

const schema = yup.object({
  email: yup
    .string()
    .email("Please enter valid email address")
    .required("Please enter your email address"),
});

const SendEmailForgotPasswordPage = () => {
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const [isMessage, setIsMessage] = useState(false);

  useEffect(() => {
    const arrError = Object.values(errors);
    if (arrError.length > 0) {
      toast.error(arrError[0]?.message, {
        pauseOnHover: false,
        delay: 0,
      });
    }
  }, [errors]);

  const handleChangePass = async (values) => {
    if (!isValid) return;
    const { email } = values;
    const response = await apiForgotPassword(email);
    if (response.success) {
      setIsMessage(true);
      reset();
    }
  };

  return (
    <div>
      <h2 className="flex items-center justify-center mb-10 text-2xl font-bold text-gray-400">
        Forgot Password
      </h2>

      <form
        className="w-full max-w-lg mx-auto"
        onSubmit={handleSubmit(handleChangePass)}
        autoComplete="off"
      >
        <Field>
          <Label htmlFor="email">Email</Label>
          <InputAuth
            type="email"
            name="email"
            placeholder="Enter your email"
            control={control}
          />
        </Field>
        {isMessage && (
          <p className="mb-5 font-semibold text-red-600">
            We sent an email to your address please check your email!
          </p>
        )}

        <div className="have-account">
          Head back to <NavLink to={"/sign-in"}>Login</NavLink>{" "}
        </div>
        <div className="flex items-center justify-center gap-3 mt-5">
          <Button
            type="submit"
            className="w-full max-w-[300px] mx-auto"
            width="150px"
            height="45px"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            Send email
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SendEmailForgotPasswordPage;
