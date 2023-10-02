/* eslint-disable react/prop-types */
import { Fragment } from "react";
import Topic from "./Topic";

const TopicList = ({
  title = "Following topics",
  data = ["hentai", "echi"],
  className = "",
}) => {
  if (data?.length === 0) return null;
  return (
    <Fragment>
      <div className={` ${className}`}>
        <h3 className={"mb-5 text-lg font-semibold"}>{title}</h3>
        {data.map((value, index) => (
          <Topic key={index} className="mb-3 mr-3">
            {value}
          </Topic>
        ))}
      </div>
    </Fragment>
  );
};

export default TopicList;
