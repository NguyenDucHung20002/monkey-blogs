/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { icons } from "../../utils/constants";
import useTimeAgo from "../../hooks/useTimeAgo";
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

const UserTable = () => {
  const getTimeAgo = useTimeAgo;
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  const [statusRender, setStatusRender] = useState(false);
  const [search, setSearch] = useState("");
  const banTypes = ["1week", "1month", "1year", "permanent"];
  const skip = useRef("0");

  useEffect(() => {
    async function fetchUsers() {
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
      return [];
    }

    fetchUsers();
  }, [statusRender, token, search]);

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
          placeholder="Search username"
          onChange={handleChangeSearch}
        />
        <div className="mr-4 text-blue-400">{icons.searchIcon}</div>
      </div>
      <Table dataSource={users} pagination={false} className="overflow-y-auto">
        <Column
          title="Username"
          key="username"
          render={(user) => (
            <p className="font-medium whitespace-nowrap">{user.username}</p>
          )}
        />
        <Column title="Accusers" dataIndex="bansCount" key="bansCount" />
        <Column
          title="Crated time"
          key="createdAt"
          render={(user) => (
            <p className="whitespace-nowrap">{getTimeAgo(user.createdAt)}</p>
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
                banType={user.banType}
                bannedUntil={user.bannedUntil}
              ></ButtonBaned>
            )
          }
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
