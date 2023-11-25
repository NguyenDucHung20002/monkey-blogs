import React from "react";
import { useSocket } from "../../contexts/SocketContext";
import { Link } from "react-router-dom";
import timeSince from "../modulesJs/timeAgo";
const Notify = React.forwardRef(( props,ref ) =>
{
  const { notifications } = useSocket();

  return (
  <div ref={ref} id="notify">
    <div className="absolute top-full right-2 z-auto bg-white">
      <div className="w-96 max-h-[800px]  shadow-lg rounded-lg overflow-y-scroll ">
        <div className="p-2">
          <h1 className="text-lg font-bold">Notification</h1>
          <div className="mt-3">
            {notifications?.map((val, idx) =>
            (<Link key={idx} to={`/blog/${val.slugArticle}`}>
              <div className="flex items-center py-2 hover:bg-stone-100 rounded-lg cursor-pointer ">
                <div className="m-2">
                  <img className="w-14 h-14 rounded-1/2 overflow-hidden" src={val.avatarSender} alt="" />
                </div>
                <div className="flex-1">
                  <p className="line-clamp-3 text-base">{val.content} </p>
                  <div className="">{timeSince(val.createdAt)}</div>
                </div>
                {/* <div className="relative bg-lime-400 w-3 h-3 rounded-1/2"></div> */}
              </div>
            </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>)
})

export default Notify;