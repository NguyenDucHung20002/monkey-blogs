/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useRef, useState } from "react";
import BlogImage from "./BlogImage";
import BlogMeta from "./BlogMeta";
import BlogTitle from "./BlogTitle";
import styled from "styled-components";
import { Avatar, Checkbox, Modal, Popover, Select } from "antd";
import { Link } from "react-router-dom";
import Topic from "../topic/Topic";
import useTimeAgo from "../../hooks/useTimeAgo";
import { icons } from "../../utils/constants";
import {
  apiAddReadingList,
  apiDeleteReadingList,
  apiReportBlog,
} from "../../api/apisHung";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import { apiBlockUser, apiMuteUser } from "../../api/api";

const BlogStyle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding-bottom: 20px;
`;

const Blog = ({ blog, isMyProfile, mute = {} }) => {
  const { setMuteId } = mute;
  const { id, title, preview, img, slug, topic, author, createdAt, isSaved } =
    blog;

  const checkMyProfile = isMyProfile ? isMyProfile : isSaved;
  const [isSaveList, setIsSaveList] = useState(checkMyProfile);
  const getTimeAgo = useTimeAgo(createdAt);
  const token = localStorage.getItem("token");
  const [open, setOpen] = useState(false);
  const [openModalReporter, setOpenModalReporter] = useState(false);
  const reportForm = useRef({ reason: "", block: false });

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const handleSaveList = async () => {
    let response;
    if (!isSaveList) {
      response = await apiAddReadingList(token, id);
    } else {
      response = await apiDeleteReadingList(token, id);
    }
    if (response?.success) setIsSaveList(!isSaveList);
  };

  const handleMuteAuthor = async () => {
    if (setMuteId) {
      const response = await apiMuteUser("post", token, author?.id);
      if (response) {
        setMuteId(author?.id);
      }
    }
  };

  const handleOpenModal = () => {
    setOpenModalReporter(true);
    setOpen(false);
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

  // eslint-disable-next-line no-unused-vars
  const onCheckbox = (e) => {
    reportForm.current.block = e.target.checked;
  };

  const onReason = debounce((e) => {
    reportForm.current.reason = e;
  }, 500);

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
    const response = await apiReportBlog(token, id, reason);
    if (blockAuthor) {
      const res = await apiBlockUser("post", token, author?.id);
      if (res) setMuteId(author?.id);
    }
    if (response.success) {
      toast.success(response.message, {
        pauseOnHover: false,
        delay: 200,
      });
    }
  };

  return (
    <BlogStyle className="border-b border-gray-300">
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
      <div className="flex-1 pt-3 pr-5">
        <div className="flex items-center">
          <Link to={`/profile/${author?.userInfo?.username}`}>
            <Avatar
              className="cursor-pointer"
              size="large"
              src={<img src={author?.avatar} alt="avatar" />}
            />
          </Link>
          <p className="mx-1"> </p>
          <BlogMeta
            authorName={author?.fullname}
            date={createdAt}
            to={author?.userInfo?.username}
          ></BlogMeta>
        </div>
        <p className="my-2"> </p>
        <BlogTitle to={`/blog/${slug}`} size="big">
          {title}
        </BlogTitle>
        <p className="mt-2 text-base text-gray-400 line-clamp-2">{preview}</p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center justify-start gap-3 ">
            {topic && <Topic to={`topic/${topic?.slug}`}>{topic?.name}</Topic>}
            <p className="font-medium text-gray-600">{getTimeAgo}</p>
          </div>
          <div className="flex items-center gap-1">
            <Popover placement="leftTop" content={<p>Save to List</p>}>
              <button className="flex items-center " onClick={handleSaveList}>
                {isSaveList ? icons.savedIcon : icons.saveIcon}
              </button>
            </Popover>
            <Popover
              content={blogAction}
              trigger="click"
              open={open}
              onOpenChange={handleOpenChange}
            >
              <button className="flex items-center">{icons.moreIcon}</button>
            </Popover>
          </div>
        </div>
      </div>
      {img && (
        <BlogImage
          className="flex-shrink-0"
          url={img}
          alt=""
          to={`/blog/${slug}`}
        ></BlogImage>
      )}
    </BlogStyle>
  );
};

export default Blog;
