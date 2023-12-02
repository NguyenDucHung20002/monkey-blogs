/* eslint-disable react/prop-types */
import { useState } from "react";

const UserReportsContent = ({ reason, description }) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div>
      <p className="mb-2 text-base font-medium">
        Reason: <span className="text-gray-400">{reason}</span>{" "}
      </p>
      {description && (
        <p
          className={`mt-3 content font-medium text-base ${
            !showMore && "line-clamp-2"
          }`}
        >
          Description: <span className="text-gray-400">{description}</span>
        </p>
      )}

      {description.length > 150 && (
        <button
          onClick={() => setShowMore(!showMore)}
          className="text-green-400 transition-all hover:text-green-600"
        >
          {showMore ? "Hide" : "Show more"}
        </button>
      )}
    </div>
  );
};

export default UserReportsContent;
