/* eslint-disable react/prop-types */
import { useCallback, useEffect, useRef, useState } from "react";
import { icons } from "../../utils/constants";
import { NavLink } from "react-router-dom";
import { Tag, Table, Popover } from "antd";
import Column from "antd/es/table/Column";
import {
  apiBanAUser,
  apiGetAllUsers,
  apiUnBanAUser,
  apiUpdateUserBan,
} from "../../api/api";
import { toast } from "react-toastify";
import Button from "../../components/button/Button";
import { debounce } from "lodash";
import { apiMakeAUserStaff } from "../../api/apisHung";
import { useAuth } from "../../contexts/auth-context";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  const { userInfo } = useAuth();
  const [statusRender, setStatusRender] = useState(false);
  const [search, setSearch] = useState("");
  const banTypes = ["1week", "1month", "1year", "permanent"];
  const skip = useRef("");
  const [isReload, setIsReload] = useState(false);

  const fetchUsers = useCallback(async () => {
    const response = await apiGetAllUsers(token, 15, null, search);
    if (response) {
      skip.current = response.newSkip;
      const mapUsers = response.data.map((user) => {
        return { ...user, key: user.id };
      });
      setUsers(mapUsers);
    }
  }, [search, token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, isReload]);

  const handleSetStaff = useCallback(
    async (userId) => {
      const response = await apiMakeAUserStaff(token, userId);
      if (response) {
        const mapUsers = users.filter((user) => user.id != userId);
        setUsers(mapUsers);
        toast.success(response.message, {
          pauseOnHover: false,
          delay: 150,
        });
      }
    },
    [token, users]
  );

  const handleLoadMore = async () => {
    const newSkip = skip.current;
    const response = await apiGetAllUsers(token, 15, newSkip, search);
    if (response) {
      const mapUsers = response.data.map((user) => {
        return { ...user, key: user.id };
      });
      skip.current = response.newSkip;
      setUsers([...users, ...mapUsers]);
    }
  };

  const handleLiftTheBan = async (userId) => {
    const response = await apiUnBanAUser(token, userId);
    if (response) {
      setStatusRender(!statusRender);
      toast.success(response.message, {
        pauseOnHover: false,
        delay: 150,
      });
    }
  };

  const handleUpdateBan = async (type, userId) => {
    const response = await apiUpdateUserBan(token, userId, type);
    if (response) {
      setStatusRender(!statusRender);
      toast.success(response.message, {
        pauseOnHover: false,
        delay: 150,
      });
    }
  };

  const handleBanUser = async (type, userId) => {
    const response = await apiBanAUser(token, userId, type);
    if (response) {
      setStatusRender(!statusRender);
      toast.success(response.message, {
        pauseOnHover: false,
        delay: 150,
      });
    }
  };

  const ButtonBaned = ({ bannedBy, banType, bannedUntil }) => (
    <Popover
      content={
        <div>
          <p>
            <span>Banned by</span> {bannedBy.username} ({bannedBy.role.name})
          </p>
          <p>
            <span>Ban type</span> {banType}
          </p>
          {bannedUntil ? (
            <p>
              <span>Ban until</span> {bannedUntil}
            </p>
          ) : (
            <p>Permanent ban</p>
          )}
        </div>
      }
      placement="bottom"
    >
      <Tag className="cursor-pointer" color="red">
        BANNED
      </Tag>
    </Popover>
  );

  const handleChangeSearch = debounce((e) => {
    setSearch(e.target.value);
  }, 200);

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
            {userInfo && userInfo.data.role === "admin" && (
              <button
                className="block w-full text-left hover:text-blue-400"
                onClick={() => handleSetStaff(user.id)}
              >
                Set staff
              </button>
            )}

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
          </div>
        </>
      }
    >
      <button className="flex items-center justify-center text-blue-400 rounded-md cursor-pointer w-7 h-7">
        {icons.moreIcon}
      </button>
    </Popover>
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="my-3 border-gray-300 hover:border-blue-400 text-gray-300 hover:text-blue-400 transition-all border rounded-lg w-full max-w-[320px] pl-4 flex py-1">
          <input
            className="flex-1 text-sm text-gray-500 placeholder:text-sm "
            type="text"
            placeholder="Search"
            onChange={handleChangeSearch}
          />
          <div className="flex items-center mr-3 ">{icons.searchIcon}</div>
        </div>
        <div>
          <Button
            type="button"
            height="30px"
            onClick={() => setIsReload(!isReload)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
              />
            </svg>{" "}
            <p className="ml-1 text-sm">Reload</p>
          </Button>
        </div>
      </div>
      <Table dataSource={users} pagination={false} className="overflow-y-auto">
        <Column
          title="Username"
          key="username"
          render={(user) => (
            <NavLink to={`/profile/${user.username}`} target="_blank">
              <p className="w-40 font-medium whitespace-nowrap">
                {user.username}
              </p>
            </NavLink>
          )}
        />

        <Column title="Bans" dataIndex="bansCount" key="bansCount" />

        <Column title="Reports" dataIndex="reportsCount" key="reportsCount" />

        <Column
          title="Status"
          key="status"
          render={(user) =>
            user.status === "normal" ? (
              <Tag>NORMAL</Tag>
            ) : (
              <ButtonBaned
                bannedBy={user.bannedBy}
                banType={user.banType}
                bannedUntil={user.bannedUntil}
              ></ButtonBaned>
            )
          }
        />

        <Column title="Ban type" dataIndex="banType" key="banType" />

        <Column
          title="Banned until"
          dataIndex="bannedUntil"
          key="bannedUntil"
        />

        <Column
          title="Banned by"
          key="bannedBy"
          render={(user) => {
            if (user.bannedBy) {
              return (
                <div className="flex justify-center gap-2">
                  <p className="font-semibold text-gray-500">
                    {user.bannedBy.username}
                  </p>
                  <Tag color="red">{user?.bannedBy.role.name}</Tag>
                </div>
              );
            }
          }}
        />

        <Column title="More" key="More" render={(user) => ButtonMore(user)} />
      </Table>
      {skip.current && (
        <div className="flex justify-center mt-5" onClick={handleLoadMore}>
          <Button type="button" kind="primary" height="40px">
            Load more
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserTable;
