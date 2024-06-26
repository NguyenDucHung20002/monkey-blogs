/* eslint-disable react/prop-types */
import { Checkbox, Modal, Popover, Select } from "antd";
import { icons } from "../../utils/constants";
import { useRef, useState } from "react";
import { apiBlockAUser, apiMuteAUser } from "../../api/api";
import { toast } from "react-toastify";
import { apiReportAnArticle } from "../../api/apisHung";
import { debounce } from "lodash";
import {  useNavigate } from "react-router-dom";

const ButtonActionBlogsAuthor = ({ setMuteId, blog }) => {
  const [open, setOpen] = useState(false);
  const { id, author } = blog;
  const token = localStorage.getItem("token");
  const [openModalReporter, setOpenModalReporter] = useState(false);
  const reportForm = useRef({ reason: "", block: false });
  const navigate = useNavigate();

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const onReason = debounce((e) => {
    reportForm.current.reason = e;
  }, 500);

  const handleOpenModal = () => {
    setOpenModalReporter(true);
    setOpen(false);
  };

  const handleMuteAuthor = async () => {
    const response = await apiMuteAUser("post", token, author?.id);
    if (setMuteId && response) {
      setMuteId(author?.id);
      toast.success(response.message, {
        pauseOnHover: false,
        delay: 150,
      });
      toast.success("You will no longer see their stories", {
        pauseOnHover: false,
        delay: 250,
      });
      navigate("/");
    }
  };

  const onCheckbox = (e) => {
    reportForm.current.block = e.target.checked;
  };

  const handleReportBlog = async () => {
    const reason = reportForm.current.reason;
    const blockAuthor = reportForm.current.block;
    if (!reason) {
      toast.warning("Please select a reason", {
        pauseOnHover: false,
        delay: 200,
      });
      return;
    }

    if (blockAuthor) {
      const response = await apiBlockAUser("post", token, author?.id);
      if (response) {
        setMuteId(author?.id);
        toast.success(response.message, {
          pauseOnHover: false,
          delay: 150,
        });
      }
    }

    const response = await apiReportAnArticle(token, id, reason);
    if (response) {
      toast.success(response.message, {
        pauseOnHover: false,
        delay: 150,
      });
    }

    setOpenModalReporter(false);
  };

  const blogAction = () => {
    return (
      <div className="flex flex-col items-start gap-2 text-gray-400">
        {setMuteId && (
          <button
            className="transition-all hover:text-gray-600"
            onClick={handleMuteAuthor}
          >
            Mute this author
          </button>
        )}

        <button
          className="transition-all hover:text-gray-600"
          onClick={handleOpenModal}
        >
          Report
        </button>
      </div>
    );
  };

  return (
    <>
      <Modal
        title="Report"
        centered
        open={openModalReporter}
        onOk={() => setOpenModalReporter(false)}
        onCancel={() => setOpenModalReporter(false)}
        footer={
          <div className="text-right">
            <button
              className="px-2 py-1 text-white bg-blue-300 rounded-md hover:bg-blue-400 "
              onClick={handleReportBlog}
            >
              Submit
            </button>
          </div>
        }
      >
        <div className="flex flex-col gap-5">
          <Select
            style={{ width: 120 }}
            onChange={onReason}
            allowClear
            options={[
              { value: "Harassment", label: "Harassment" },
              { value: "Rules Violation", label: "Rules Violation" },
              { value: "Spam", label: "Spam" },
            ]}
          />
          <Checkbox onChange={onCheckbox}>Also block this author</Checkbox>
        </div>
      </Modal>
      <Popover
        content={blogAction}
        trigger="click"
        open={open}
        onOpenChange={handleOpenChange}
      >
        <button className="flex items-center text-gray-400 hover:text-gray-500">
          {icons.moreIcon}
        </button>
      </Popover>
    </>
  );
};

export default ButtonActionBlogsAuthor;
