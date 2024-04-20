import { yupResolver } from "@hookform/resolvers/yup";
import { Modal } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Button } from "../../components/button";
import { apiChangePassword } from "../../api/apiNew";
import { apiCheckUserHasPassword, setUpPassword } from "../../api/apiHa";
import { toast } from "react-toastify";

const Account = () => {
  const [open, setOpen] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const token = localStorage.getItem("token");

  const schema = yup.object({
    oldPassword: hasPassword
      ? yup.string().required().min(8)
      : yup.string().optional().min(8),
    newPassword: yup.string().min(8),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword"), null], "Passwords must match"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const showModal = () => {
    setOpen(true);
  };

  const checkPassword = async () => {
    const response = await apiCheckUserHasPassword(token);
    if (response) {
      setHasPassword(response.data);
    }
  };

  useEffect(() => {
    checkPassword();
  }, []);

  const handleOk = async (values) => {
    setConfirmLoading(true);

    const operation = hasPassword
      ? apiChangePassword(
          token,
          values.oldPassword,
          values.newPassword,
          values.confirmPassword
        )
      : setUpPassword(token, values.newPassword);

    const response = await operation;
    if (response) {
      toast.success(response.message, {
        pauseOnHover: false,
        delay: 150,
      });
      setConfirmLoading(false);
      setOpen(false);
      reset();
    }
  };

  const handleCancel = () => {
    setConfirmLoading(false);
    setOpen(false);
    reset();
  };

  const footer = () => {
    return (
      <div className="flex items-center justify-end">
        <Button height="30px" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          isLoading={confirmLoading}
          height="30px"
          onClick={handleSubmit(handleOk)}
        >
          Ok
        </Button>
      </div>
    );
  };

  return (
    <>
      <div className="">
        <div
          onClick={showModal}
          className="flex items-center justify-between cursor-pointer"
        >
          <p className="py-3 ">
            {hasPassword ? "Change password" : "Set up password"}
          </p>
          <p> {hasPassword ? "*********" : ""}</p>
        </div>
        <Modal
          title={hasPassword ? "Change your password" : "Set up password"}
          open={open}
          footer={footer}
          onCancel={handleCancel}
          confirmLoading={confirmLoading}
        >
          <form
            onSubmit={handleSubmit(handleOk)}
            action=""
            style={{ paddingTop: "15px", paddingBottom: "15px" }}
          >
            {hasPassword && (
              <div className="">
                <label className="block" htmlFor="input-oldPassword">
                  Old password:
                </label>
                <input
                  className="w-full py-2 border-b focus:placeholder-transparent "
                  type="password"
                  id="input-oldPassword"
                  {...register("oldPassword")}
                />
                <p className={errors.oldPassword ? "text-red-400" : ""}>
                  {errors.oldPassword
                    ? `old password ${errors.oldPassword.message
                        .split(" ")
                        .slice(1)
                        .join(" ")}`
                    : ""}
                </p>
              </div>
            )}

            <div>
              <label className="block" htmlFor="input-newPassword">
                {hasPassword ? "New password:" : "Password"}
              </label>
              <input
                className="w-full py-2 border-b focus:placeholder-transparent "
                type="password"
                id="input-newPassword"
                {...register("newPassword")}
              />
              <p className={errors.newPassword ? "text-red-400" : ""}>
                {errors.newPassword
                  ? `new password ${errors.newPassword.message
                      .split(" ")
                      .slice(1)
                      .join(" ")}`
                  : ""}
              </p>
            </div>

            <div>
              <label className="block" htmlFor="input-confirmPassword">
                Confirm password:
              </label>
              <input
                className="w-full py-2 border-b focus:placeholder-transparent "
                type="password"
                id="input-confirmPassword"
                {...register("confirmPassword")}
              />
              <p className={errors.confirmPassword ? "text-red-400" : ""}>
                {errors.confirmPassword
                  ? `${
                      hasPassword ? "confirm password" : "password"
                    } ${errors.confirmPassword.message
                      .split(" ")
                      .slice(1)
                      .join(" ")}`
                  : ""}
              </p>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default Account;
