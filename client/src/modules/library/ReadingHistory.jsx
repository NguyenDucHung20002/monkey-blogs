import React, { useEffect, useState } from "react";
import {
  apiDeleteArticleHistory,
  apiDeleteReadingHistory,
  apiGetReadingHistory,
} from "../../api/apiNew";
import timeAgo from "../modulesJs/timeAgo";
import { Link } from "react-router-dom";
import TopicList from "../topic/TopicList";
import Swal from "sweetalert2";
import BlogImage from "../blog/BlogImage";
import { config } from "../../utils/constants";

const ReadingHistory = () => {
  const [history, setHistory] = useState([]);
  const fetchApiClearHistory = async () => {
    const response = await apiDeleteReadingHistory();
    if (response?.success) {
      setHistory([]);
    }
  };
  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        fetchApiClearHistory();
        Swal.fire("Deleted!", "Your history has been clear.", "success");
      }
    });
  };
  const getHistory = async () => {
    const response = await apiGetReadingHistory();
    if (response?.success) {
      setHistory(response.data);
    }
  };
  const handleDeleteAnArticle = async (id) => {
    const response = await apiDeleteArticleHistory(id);
    if (response?.success) {
      getHistory();
    }
  };
  useEffect(() => {
    getHistory();
  }, []);
  return (
    <div>
      <div className="rounded-sm text-base flex items-center justify-between w-full py-6 px-4 bg-stone-200">
        <div className="">
          <p>You can clear your reading history for a fresh start.</p>
        </div>
        <div className="">
          <button
            className="bg-red-500 text-white py-1 px-2 rounded-full hover:bg-red-600 "
            onClick={handleDelete}
          >
            Clear history
          </button>
        </div>
      </div>
      {history.map((val) => (
        <div key={val.id} className=" pt-6 border-b">
          <div className="">
            <p className="text-sm">{timeAgo(val?.createdAt)}</p>
          </div>
          <div className="flex mt-3">
            <div className="flex-1  max-w-[80%]">
              <Link to={`/blog/${val.slug}`}>
                <h2 className="pb-1 text-xl font-bold">{val.title}</h2>
                <p className="text-sm line-clamp-3">{val.preview} </p>
              </Link>
              <div className="flex items-center justify-between py-7">
                <TopicList data={[val?.topic]}></TopicList>
                <div className="flex items-center">
                  <button
                    onClick={() => handleDeleteAnArticle(val?.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
            {val?.banner && (
              <div className="ml-14">
                <BlogImage
                  className="flex-shrink-0"
                  url={`${config.SERVER_HOST}/file/${val?.banner}`}
                  alt=""
                  to={`/blog/${val.slug}`}
                ></BlogImage>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReadingHistory;
