/* eslint-disable react/prop-types */

import { useEffect, useRef, useState } from "react";
import {
  apiGetReportedUsers,
  apiResolveReportedUsers,
} from "../../api/apisHung";
import Avatar from "./Avatar";
import { NavLink } from "react-router-dom";
import useTimeAgo from "../../hooks/useTimeAgo";
import UserReportsContent from "./UserReportsContent";
import Button from "../../components/button/Button";

const UserModelReportReason = ({ id, token }) => {
  console.log("id:", id);
  const [users, setUsers] = useState([]);
  const getTimeAgo = useTimeAgo;
  const skip = useRef("");
  useEffect(() => {
    async function fetchReports() {
      const response = await apiGetReportedUsers(token, id, 10);
      if (response.success) {
        setUsers(response.data);
        skip.current = response.newSkip;
      }
    }
    fetchReports();
  }, [id, token]);

  const handleResolve = async (id) => {
    const response = await apiResolveReportedUsers(token, id);

    if (response.success) {
      const filterUsers = users.filter((user) => user.id != id);
      setUsers(filterUsers);
    }
  };

  if (!token && !id) return;

  return (
    <>
      {users &&
        users.length > 0 &&
        users.map((user) => (
          <div key={user.id} className="pb-2 mb-2 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4 info">
                <NavLink to={`/profile/${user.reporter.username}`}>
                  <Avatar url={user.reporter.avatar} size="medium"></Avatar>
                </NavLink>
                <div>
                  <NavLink to={`/profile/${user.reporter.username}`}>
                    <p className="font-medium">{user.reporter.username}</p>
                  </NavLink>
                  <p className="font-medium text-gray-400">
                    {getTimeAgo(user.createdAt)}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                height="35px"
                onClick={() => handleResolve(user.id)}
              >
                RESOLVED
              </Button>
            </div>

            <UserReportsContent
              reason={user.reason}
              description={user.description}
            ></UserReportsContent>
          </div>
        ))}
    </>
  );
};

export default UserModelReportReason;
