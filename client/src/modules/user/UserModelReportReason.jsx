/* eslint-disable react/prop-types */

import { useEffect, useRef, useState, useCallback } from "react";
import {
  apiGetPendingReportsOfAUser,
  apiMarkAReportOfAUserAsResolved,
} from "../../api/apisHung";
import { NavLink } from "react-router-dom";
import useTimeAgo from "../../hooks/useTimeAgo";
import UserReportsContent from "./UserReportsContent";
import Button from "../../components/button/Button";
import { Tag } from "antd";
import { toast } from "react-toastify";

const UserModelReportReason = ({ id, token }) => {
  const [users, setUsers] = useState([]);
  const getTimeAgo = useTimeAgo;
  const skip = useRef("");

  useEffect(() => {
    async function fetchReports() {
      const response = await apiGetPendingReportsOfAUser(token, id, 1);
      if (response) {
        setUsers([...response.data]);
        skip.current = response.newSkip;
      }
    }
    fetchReports();
  }, [id, token]);

  const handleLoadMore = useCallback(async () => {
    const response = await apiGetPendingReportsOfAUser(
      token,
      id,
      1,
      skip.current
    );
    if (response) {
      skip.current = response.newSkip;
      setUsers([...users, ...response.data]);
    }
  }, [users]);

  const handleResolve = async (id) => {
    const response = await apiMarkAReportOfAUserAsResolved(token, id);

    if (response) {
      const filterUsers = users.filter((user) => user.id != id);
      setUsers(filterUsers);
      toast.success(response.message, {
        pauseOnHover: false,
        delay: 150,
      });
    }
  };

  if (!token && !id) return;

  return (
    <>
      <div>
        {users &&
          users.length > 0 &&
          users.map((user) => (
            <div key={user.id} className="pb-2 mb-2 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-4 info">
                    <NavLink to={`/profile/${user.reporter.username}`}>
                      <p className="font-medium text-base">
                        {user.reporter.username}
                      </p>
                    </NavLink>
                    {user.reporter.role.name === "User" ? (
                      <Tag color="green">{user.reporter.role.name}</Tag>
                    ) : (
                      <Tag color="red">{user.reporter.role.name}</Tag>
                    )}
                  </div>
                  <p className="font-medium text-gray-400">
                    {getTimeAgo(user.createdAt)}
                  </p>
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
      </div>
      {skip.current && (
        <div className="flex justify-center mt-5" onClick={handleLoadMore}>
          <Button type="button" kind="primary" height="40px">
            Load more
          </Button>
        </div>
      )}
    </>
  );
};

export default UserModelReportReason;
