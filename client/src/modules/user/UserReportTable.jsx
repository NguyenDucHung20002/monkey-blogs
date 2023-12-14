/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { icons } from "../../utils/constants";
import { NavLink } from "react-router-dom";
import { Tag, Table, Popover, Drawer } from "antd";
import Column from "antd/es/table/Column";
import { apiBanUser, apiLiftTheBan, apiUpdateBan } from "../../api/api";
import { toast } from "react-toastify";
import {
  apiGetPendingReportUsers,
  apiResolveReportedAllUsers,
} from "../../api/apisHung";
import UserModelReportReason from "./UserModelReportReason";

const UserReportTable = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  const [statusRender, setStatusRender] = useState(false);
  const banTypes = ["1week", "1month", "1year", "permanent"];
  const skip = useRef("");
  const skipCount = useRef("");
  const [open, setOpen] = useState(false);
  const [userReportedId, setUserReportedId] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      const response = await apiGetPendingReportUsers(token);
      if (response) {
        skip.current = response.newSkipId;
        skipCount.current = response.newSkipCount;
        const mapUsers = response.data.map((user) => {
          return {
            ...user,
            key: user.id,
          };
        });
        setUsers(mapUsers);
      }
      return [];
    }

    fetchUsers();
  }, [statusRender, token]);

  // const handleLoadMore = async () => {
  //   const newSkip = skip.current;
  //   const newSkipCount = skipCount.current;
  //   const response = await apiGetPendingReportUsers(
  //     token,
  //     2,
  //     newSkip,
  //     newSkipCount
  //   );
  //   if (response) {
  //     const mapUsers = response.data.map((user) => {
  //       return {
  //         ...user,
  //         key: user.id,
  //       };
  //     });
  //     setUsers([...users, ...mapUsers]);
  //     skip.current = response.newSkipId;
  //     skipCount.current = response.newSkipCount;
  //   }
  //   return [];
  // };

  const handleLiftTheBan = async (userId) => {
    const response = await apiLiftTheBan(token, userId);
    if (response?.success) {
      toast.success(response.message, {
        pauseOnHover: true,
        delay: 200,
      });
      setStatusRender(!statusRender);
    }
  };

  const handleUpdateBan = async (type, userId) => {
    const response = await apiUpdateBan(token, userId, type);
    if (response?.success) {
      toast.success(response.message, {
        pauseOnHover: true,
        delay: 200,
      });
      setStatusRender(!statusRender);
    }
  };

  const handleBanUser = async (type, userId) => {
    const response = await apiBanUser(token, userId, type);
    if (response?.success) {
      toast.success(response.message, {
        pauseOnHover: true,
        delay: 200,
      });
      setStatusRender(!statusRender);
    }
  };

  const handleResolveReports = async (id) => {
    const response = await apiResolveReportedAllUsers(token, id);

    if (response?.success) {
      const filterUsers = users.filter((user) => user.id != id);
      setUsers(filterUsers);
    }
  };

  const handleShowDrawer = (id) => {
    setUserReportedId(id);
    setOpen(true);
  };

  const ButtonBaned = ({ bannedBy, bannedUntil, banType }) => (
    <Popover
      content={
        <div>
          <p>
            <span>Banned by</span> {bannedBy.username}
          </p>
          {bannedUntil && (
            <p>
              <span>Ban until</span> {bannedUntil}
            </p>
          )}
          <p>
            <span>Banned type</span> {banType}
          </p>
        </div>
      }
      placement="bottom"
    >
      <Tag className="cursor-pointer" color="red">
        BANNED
      </Tag>
    </Popover>
  );

  const ButtonMore = (user) => (
    <Popover
      placement="bottomRight"
      title={
        <>
          <p>{user.username}</p>
        </>
      }
      content={
        <>
          <div className="w-full">
            <NavLink
              className="block w-full py-2"
              to={`/profile/${user.username}`}
            >
              <span className="font-medium">Profile</span>
            </NavLink>
            {user.status === "normal" && (
              <Popover
                placement="left"
                content={
                  <>
                    {banTypes.map((type, index) => (
                      <button
                        key={index}
                        className="block w-full p-1 text-left hover:text-blue-400"
                        onClick={() => handleBanUser(type, user.id)}
                      >
                        {type}
                      </button>
                    ))}
                  </>
                }
              >
                <button className="block w-full py-2 text-left hover:text-blue-400">
                  Ban user
                </button>
              </Popover>
            )}

            {user.status === "banned" && (
              <>
                <Popover
                  placement="left"
                  content={
                    <>
                      {banTypes.map((type, index) => (
                        <button
                          key={index}
                          className="block w-full p-1 text-left hover:text-blue-400"
                          onClick={() => handleUpdateBan(type, user.id)}
                        >
                          {type}
                        </button>
                      ))}
                    </>
                  }
                >
                  <button className="block w-full py-2 text-left hover:text-blue-400">
                    Edit ban
                  </button>
                </Popover>
                <button
                  className="block w-full py-2 text-left hover:text-blue-400"
                  onClick={() => handleLiftTheBan(user.id)}
                >
                  Lift the ban
                </button>
              </>
            )}
            <div>
              <button
                className="block w-full py-2 text-left hover:text-blue-400"
                onClick={() => handleResolveReports(user.id)}
              >
                Resolve all reports
              </button>
            </div>
            <div>
              <button
                className="block w-full py-2 text-left hover:text-blue-400"
                onClick={() => handleShowDrawer(user.id)}
              >
                Show Reasons
              </button>
            </div>
          </div>
        </>
      }
    >
      <button className="flex items-center justify-center text-blue-400 rounded-md cursor-pointer w-7 h-7">
        {icons.moreIcon}
      </button>
      <div></div>
    </Popover>
  );

  return (
    <div>
      <Table dataSource={users} pagination={false} className="overflow-y-auto">
        <Column
          title="Username"
          key="username"
          render={(user) => (
            <p className="font-medium whitespace-nowrap">{user.username}</p>
          )}
        />
        <Column
          title="Username"
          key="username"
          render={(user) => (
            <p className="font-medium whitespace-nowrap">{user.email}</p>
          )}
        />
        <Column
          title="Status"
          key="status"
          render={(user) =>
            user.status === "normal" ? (
              <Tag>NORMAL</Tag>
            ) : (
              <ButtonBaned
                bannedBy={user.bannedBy}
                bannedUntil={user.bannedUntil}
                banType={user.banType}
              ></ButtonBaned>
            )
          }
        />
        <Column title="Accusers" dataIndex="reportsCount" key="reportsCount" />
        <Column title="More" key="More" render={(user) => ButtonMore(user)} />
      </Table>
      {userReportedId && (
        <Drawer
          title="Reports"
          placement="right"
          width={450}
          onClose={() => setOpen(false)}
          open={open}
        >
          <UserModelReportReason
            id={userReportedId}
            token={token}
          ></UserModelReportReason>
        </Drawer>
      )}

      {/* {users && users.length > 0 && (
        <div className="flex justify-center mt-5" onClick={handleLoadMore}>
          <Button type="button" kind="primary" height="40px">
            Load more
          </Button>
        </div>
      )} */}
    </div>
  );
};

export default UserReportTable;
