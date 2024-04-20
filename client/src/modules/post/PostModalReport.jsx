import { useCallback, useEffect, useState, useRef } from "react";
import {
  apiGetPendingReportsOfAnArticle,
  apiMarkAReportOfAnArticleAsResolved,
} from "../../api/apisHung";
import useTimeAgo from "../../hooks/useTimeAgo";
import { Button, Popover, Tag } from "antd";
import { icons } from "../../utils/constants";
import { toast } from "react-toastify";
import { debounce } from "lodash";

// eslint-disable-next-line react/prop-types
const PostModalReport = ({ blogId, token }) => {
  const [reasons, setReasons] = useState([]);
  const getTimeAgo = useTimeAgo;
  const skip = useRef("");
  const windowHeight = useRef(window.innerHeight);
  const scrollY = useRef(window.scrollY);
  const documentHeight = useRef(document.documentElement.scrollHeight);

  const fetchReasonBlog = useCallback(async () => {
    const response = await apiGetPendingReportsOfAnArticle(token, blogId, 10);
    if (response) {
      skip.current = response.newSkip;
      setReasons([...response.data]);
    }
  }, [blogId, token]);

  useEffect(() => {
    fetchReasonBlog();
  }, [token]);

  const handleLoadMore = async () => {
    if (skip.current) {
      const response = await apiGetPendingReportsOfAnArticle(
        token,
        blogId,
        15,
        skip.current
      );
      if (response) {
        skip.current = response.newSkip;
        setReasons([...reasons, ...response.data]);
      }
    }
  };

  // useEffect(() => {
  //   console.log("121321321");
  //   const handleScroll = async () => {
  //     windowHeight.current = window.innerHeight;
  //     scrollY.current = window.scrollY;
  //     documentHeight.current = document.documentElement.scrollHeight;
  //     if (
  //       windowHeight.current + scrollY.current + 10 >= documentHeight.current &&
  //       skip.current
  //     ) {
  //     }
  //   };
  //   const debouncedScroll = debounce(handleScroll, 200);

  //   window.addEventListener("scroll", debouncedScroll);

  //   return () => {
  //     window.removeEventListener("scroll", debouncedScroll);
  //   };
  // }, [reasons]);

  const handleMarkReport = useCallback(
    async (id) => {
      const response = await apiMarkAReportOfAnArticleAsResolved(token, id);
      if (response) {
        const reasonsFilter = reasons.filter((reason) => reason.id != id);
        if (reasonsFilter.length === 0) {
          setReasons(reasonsFilter);
        }

        toast.success(response.message, {
          pauseOnHover: false,
          delay: 150,
        });
      }
    },
    [reasons, token]
  );

  return (
    <>
      <div>
        {reasons &&
          reasons.length > 0 &&
          reasons.map((reason) => (
            <div
              key={reason.id}
              className="bg-gray-800 p-2 font-semibold flex rounded-md mb-5 justify-between items-center"
            >
              <div className="flex flex-col gap-2">
                <p className="text-gray-200">
                  {reason.user.username} -{" "}
                  <span>{getTimeAgo(reason.createdAt)}</span>
                </p>
                <p className="text-gray-200">{reason.user.email}</p>
                <h2 className="text-white">
                  Reason: <span className="text-red-300">{reason.reason}</span>{" "}
                  <Tag color="yellow">{reason.status}</Tag>
                </h2>
              </div>
              <Popover placement="left" content={<p>Mark this report</p>}>
                <button
                  className="text-black bg-white h-6 w-6 flex items-center justify-center rounded-md mr-5"
                  onClick={() => handleMarkReport(reason.id)}
                >
                  {icons.checkIcon}
                </button>
              </Popover>
            </div>
          ))}
      </div>
      {skip.current != null && (
        <div className="flex justify-center mt-5" onClick={handleLoadMore}>
          <Button
            type="button"
            kind="primary"
            height="40px"
            className="bg-blue-500 hover:bg-blue-700 text-white"
          >
            Load more
          </Button>
        </div>
      )}
    </>
  );
};

export default PostModalReport;
