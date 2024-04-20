import { useCallback, useEffect, useState, useRef } from "react";
import {
  apiDeleteAnArticleInReadingHistory,
  apiClearReadingHistory,
  apiGetReadingHistory,
} from "../../api/apiNew";
import timeAgo from "../modulesJs/timeAgo";
import { Link } from "react-router-dom";
import TopicList from "../topic/TopicList";
import Swal from "sweetalert2";
import BlogImage from "../blog/BlogImage";
import ClearAll from "../../components/modalClear/ClearAll";
import { toast } from "react-toastify";
import { Skeleton } from "antd";
import { debounce } from "lodash";

const ReadingHistory = () => {
  const [history, setHistory] = useState([]);
  const token = localStorage.getItem("token");
  const skip = useRef("");
  const windowHeight = useRef(window.innerHeight);
  const scrollY = useRef(window.scrollY);
  const documentHeight = useRef(document.documentElement.scrollHeight);

  const fetchApiClearHistory = async () => {
    const response = await apiClearReadingHistory(token);
    if (response) {
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

  const getHistory = useCallback(async () => {
    const response = await apiGetReadingHistory(token, 15);
    if (response?.success) {
      setHistory([...response.data]);
      skip.current = response.newSkip;
    }
  }, []);

  const handleDeleteAnArticle = useCallback(
    async (id) => {
      const response = await apiDeleteAnArticleInReadingHistory(token, id);
      if (response) {
        getHistory();
        toast.success(response.message, {
          pauseOnHover: false,
          delay: 150,
        });
      }
    },
    [getHistory]
  );

  useEffect(() => {
    getHistory();
  }, [getHistory]);

  useEffect(() => {
    const handleScroll = async () => {
      windowHeight.current = window.innerHeight;
      scrollY.current = window.scrollY;
      documentHeight.current = document.documentElement.scrollHeight;
      if (
        windowHeight.current + scrollY.current + 10 >= documentHeight.current &&
        skip.current
      ) {
        const response = await apiGetReadingHistory(token, 15, skip.current);
        if (response) {
          const readingHistoryClone = [...history, ...response.data];
          setHistory([...readingHistoryClone]);
          skip.current = response.newSkip;
        }
      }
    };
    const debouncedScroll = debounce(handleScroll, 200);

    window.addEventListener("scroll", debouncedScroll);

    return () => {
      window.removeEventListener("scroll", debouncedScroll);
    };
  }, [history]);

  return (
    <div>
      <ClearAll
        title={"You can clear your reading history for a fresh start."}
        titlebtn={"Clear history"}
        handleDelete={handleDelete}
      />
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
            {val?.banner ? (
              <div className="ml-14">
                <BlogImage
                  className="flex-shrink-0"
                  url={val?.banner}
                  alt=""
                  to={`/blog/${val.slug}`}
                ></BlogImage>
              </div>
            ) : (
              <div className="ml-14">
                <Skeleton.Image
                  active={false}
                  style={{
                    width: "120px",
                    height: "120px",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReadingHistory;
