/* eslint-disable react/prop-types */
import { useCallback, useEffect, useRef, useState } from "react";
import { icons } from "../../utils/constants";
import { NavLink } from "react-router-dom";
import { Tag, Table, Popover } from "antd";
import Column from "antd/es/table/Column";
import {
  apiBanUser,
  apiGetAllUser,
  apiLiftTheBan,
  apiUpdateBan,
} from "../../api/api";
import { toast } from "react-toastify";
import Button from "../../components/button/Button";
import { debounce } from "lodash";
import { apiSetStaff } from "../../api/apisHung";
import { useAuth } from "../../contexts/auth-context";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  const { userInfo } = useAuth();
  const { role } = (userInfo && userInfo.role) || "";
  const [statusRender, setStatusRender] = useState(false);
  const [search, setSearch] = useState("");
  const banTypes = ["1week", "1month", "1year", "permanent"];
  const skip = useRef("");

  const fetchUsers = useCallback(async () => {
    const response = await apiGetAllUser(token, 10, null, search);
    if (response) {
      skip.current = response.newSkip;
      const mapUsers = response.data.map((user) => {
        return {
          ...user,
          key: user.id,
        };
      });
      setUsers(mapUsers);
    }
  }, [search, token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSetStaff = useCallback(
    async (userId) => {
      const response = await apiSetStaff(token, userId);
      if (response) {
        const mapUsers = users.filter((user) => user.id != userId);
        setUsers(mapUsers);
      }
    },
    [token, users]
  );

  const handleLoadMore = async () => {
    const newSkip = skip.current;
    const response = await apiGetAllUser(token, 10, newSkip, search);
    if (response) {
      const mapUsers = response.data.map((user) => {
        return {
          ...user,
          key: user.id,
        };
      });
      skip.current = response.newSkip;
      setUsers([...users, ...mapUsers]);
    }
    return [];
  };

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
            {role && role === "admin" && (
              <button
                className="block w-full text-left hover:text-blue-400"
                onClick={() => handleSetStaff(user.id)}
              >
                Set Staff
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
      <div className="my-3  border-blue-400 border rounded-lg max-w-[320px] pl-4 flex py-2">
        <input
          className="flex-1 text-sm placeholder:text-sm"
          type="text"
          placeholder="Search"
          onChange={handleChangeSearch}
        />
        <div className="mr-4 text-blue-400">{icons.searchIcon}</div>
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
      <div className="flex justify-center mt-5" onClick={handleLoadMore}>
        <Button type="button" kind="primary" height="40px">
          Load more
        </Button>
      </div>
    </div>
  );
};

export default UserTable;
