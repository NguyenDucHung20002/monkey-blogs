import { Popover } from "antd";
import React, { useEffect, useState } from "react";
import { apiDeleteDarft, apiGetMyDraft } from "../../api/apiNew";
import timeAgo from "../modulesJs/timeAgo";
import { Link } from "react-router-dom";
import { apiDeleteDraft } from "../../api/api";
const PopoverContent = ({ id, handleDeleteDraft }) => {
  return (
    <div className="">
      <button className="block mb-3 hover:text-black">
        <Link to={`/edit-blog/${id}`}>Edit Draft</Link>
      </button>
      <button
        onClick={() => handleDeleteDraft(id)}
        className="text-red-400 hover:text-red-600"
      >
        Delete Draft
      </button>
    </div>
  );
};
const MyDraft = () => {
  const [draft, setDrafts] = useState([]);
  async function fetchDrafts() {
    const response = await apiGetMyDraft(localStorage.getItem("token"));
    if (response?.success) setDrafts(response?.data);
  }
  const handleDeleteDraft = async (id) => {
    const response = await apiDeleteDraft(id);
    if (response?.success) {
      fetchDrafts();
    }
  };
  useEffect(() => {
    fetchDrafts();
  }, []);
  console.log(draft);
  return (
    <>
      {draft?.map((val, idx) => (
        <div
          key={val?.id}
          className="text-base py-3 border-b w-full overflow-hidden"
        >
          <Link className="font-bold line-clamp-1" to={`/edit-blog/${val?.id}`}>
            {val?.title || "Untitled story"}
          </Link>
          <p className="">{val?.preview || ""}</p>
          <div className="flex items-center py-1">
            <span>Created {timeAgo(val?.createdAt)}</span>
            <Popover
              className="ml-1"
              trigger={"click"}
              content={
                <PopoverContent
                  handleDeleteDraft={handleDeleteDraft}
                  id={val?.id}
                />
              }
              placement="bottom"
            >
              <svg width="21" height="21" viewBox="0 0 21 21">
                <path
                  d="M4 7.33L10.03 14l.5.55.5-.55 5.96-6.6-.98-.9-5.98 6.6h1L4.98 6.45z"
                  fillRule="evenodd"
                ></path>
              </svg>
            </Popover>
          </div>
        </div>
      ))}
    </>
  );
};

export default MyDraft;
