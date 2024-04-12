import { yupResolver } from "@hookform/resolvers/yup";
import { Modal } from "antd";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Button } from "../../components/button";
import { apiChangePassword } from "../../api/apiNew";
import { toast } from "react-toastify";

const Account = () => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const schema = yup.object({
    oldPassword: yup.string().required().min(8),
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

  const handleOk = async (values) => {
    setConfirmLoading(true);
    const { oldPassword, newPassword, confirmPassword } = values;

    const response = await apiChangePassword(
      oldPassword,
      newPassword,
      confirmPassword
    );

    toast.success(response.message, {
      pauseOnHover: false,
      delay: 150,
    });
    setConfirmLoading(false);
    setOpen(false);
    reset();
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
          <p className="py-3 ">Change password</p>
          <p>*********</p>
        </div>
        <Modal
          title="Change your password"
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
            <div className="">
              <label className="block font-bold" htmlFor="input-oldPassword">
                Old password
              </label>
              <input
                className="w-full py-2 border-b focus:placeholder-transparent "
                type="password"
                id="input-oldPassword"
                // placeholder="type your password"
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
            <div>
              <label className="block font-bold" htmlFor="input-newPassword">
                New password
              </label>
              <input
                className="w-full py-2 border-b focus:placeholder-transparent "
                type="password"
                id="input-newPassword"
                // placeholder="type your new password"
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
              <label
                className="block font-bold"
                htmlFor="input-confirmPassword"
              >
                Confirm password
              </label>
              <input
                className="w-full py-2 border-b focus:placeholder-transparent "
                type="password"
                id="input-confirmPassword"
                // placeholder="repeat your new password"
                {...register("confirmPassword")}
              />
              <p className={errors.confirmPassword ? "text-red-400" : ""}>
                {errors.confirmPassword
                  ? `confirm password ${errors.confirmPassword.message
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
