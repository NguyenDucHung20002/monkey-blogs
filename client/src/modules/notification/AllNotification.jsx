import { Link } from "react-router-dom";
import timeSince from "../modulesJs/timeAgo";
import Avatar from "../user/Avatar";
import { useSocket } from "../../contexts/SocketContext";
import logo from "../../assets/logo.png";

const AllNotification = () => {
  const { notifications } = useSocket();

  return (
    <>
      <div className="">
        {notifications &&
          notifications.length > 0 &&
          notifications?.map((val, idx) => (
            <Link
              key={idx}
              to={val?.article?.slug ? `/blog/${val?.article?.slug}` : `/`}
              onClick={(e) => {
                if (!val?.article?.slug) {
                  e.preventDefault();
                }
              }}
            >
              <div
                className={`flex items-center py-3 hover:bg-stone-100  cursor-pointer ${
                  !val?.isRead && "bg-stone-100"
                }`}
              >
                <div className="m-2">
                  <Avatar
                    size="medium"
                    url={val?.sender?.avatar || logo}
                  ></Avatar>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold  ">{val?.content} </p>
                  <div className="text-xs text-gray-400">
                    {timeSince(val?.createdAt) || "now"}
                  </div>
                </div>
                {/* <div className="relative bg-lime-400 w-3 h-3 rounded-1/2"></div> */}
              </div>
            </Link>
          ))}
      </div>
    </>
  );
};

export default AllNotification;
