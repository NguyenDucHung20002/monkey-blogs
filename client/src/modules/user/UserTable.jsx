/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { icons } from "../../utils/constants";
import useTimeAgo from "../../hooks/useTimeAgo";
import { NavLink } from "react-router-dom";
import { Tag, Table, Popover } from "antd";
import Column from "antd/es/table/Column";
import { apiGetAllUser } from "../../api/api";

const UserTable = () => {
  const getTimeAgo = useTimeAgo;
  const [users, setUsers] = useState([]);
  console.log("users:", users);
  const banTypes = ["1week", "1month", "1year", "permanent"];

  useEffect(() => {
    async function fetchUsers() {
      const response = await apiGetAllUser();
      if (response) {
        console.log("response:", response);
        setUsers(response.data);
      }
      return [];
    }

    fetchUsers();
  }, []);

  const handleLiftTheBan = () => {};

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
              className="w-full block py-2"
              to={`/profile/${user.username}`}
            >
              <span className="font-medium">Profile</span>
            </NavLink>
            {user.status === "normal" && (
              <Popover
                placement="left"
                content={
                  <>
                    {banTypes.map((type) => (
                      <button
                        key={type}
                        className="block w-full p-1 hover:text-blue-400 text-left"
                      >
                        {type}
                      </button>
                    ))}
                  </>
                }
              >
                <button className="block w-full py-2 hover:text-blue-400 text-left">
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
                      {banTypes.map((type) => (
                        <button
                          key={type}
                          className="block w-full p-1 hover:text-blue-400 text-left"
                        >
                          {type}
                        </button>
                      ))}
                    </>
                  }
                >
                  <button className="block w-full py-2 hover:text-blue-400 text-left">
                    Edit ban
                  </button>
                </Popover>
                <button
                  className="block w-full py-2 hover:text-blue-400 text-left"
                  onClick={(type) => handleLiftTheBan(type)}
                >
                  Lift the ban
                </button>
              </>
            )}
          </div>
        </>
      }
    >
      <button className=" text-blue-400  flex justify-center items-center  w-7 h-7 rounded-md cursor-pointer  ">
        {icons.moreIcon}
      </button>
    </Popover>
  );

  return (
    <div>
      <Table dataSource={users} pagination={false}>
        <Column title="Id" dataIndex="id" key="id" />
        <Column title="Username" dataIndex="username" key="username" />
        <Column title="Accusers" dataIndex="bansCount" key="bansCount" />
        <Column
          title="Crated time"
          key="createdAt"
          render={(user) => <p>{getTimeAgo(user.createdAt)}</p>}
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
    </div>
  );
};

export default UserTable;
