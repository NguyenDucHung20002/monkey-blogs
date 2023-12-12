/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { apiApproveTopic, apiDeleteTopic, apiGetTopics } from "../../api/api";
import Column from "antd/es/table/Column";
import Button from "../../components/button/Button";
import { Popover, Table, Tag } from "antd";
import { icons } from "../../utils/constants";
import useTimeAgo from "../../hooks/useTimeAgo";
import { debounce } from "lodash";
import ActionEdit from "../../action/ActionEdit";
import ActionDelete from "../../action/ActionDelete";
import { useNavigate } from "react-router-dom";
import ActionApproved from "../../action/ActionApproved";
import { useAuth } from "../../contexts/auth-context";

const TopicTable = () => {
  const token = localStorage.getItem("token");
  const { userInfo } = useAuth();
  const [topics, setTopics] = useState([]);
  console.log("topics:", topics);
  const skip = useRef("");
  const getTimeAgo = useTimeAgo;
  const [searchTopic, setSearchTopic] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTopics() {
      const response = await apiGetTopics(token, 5, searchTopic);
      const mapTopics = response.data.map((topic) => {
        return {
          ...topic,
          key: topic.id,
        };
      });
      setTopics(mapTopics);
      skip.current = response.newSkip;
    }
    fetchTopics();
  }, [token, searchTopic]);

  const handleChangeSearch = debounce((e) => {
    setSearchTopic(e.target.value);
  }, 200);

  const handleLoadMore = async () => {
    const newSkip = skip.current;
    const response = await apiGetTopics(token, 10, searchTopic, newSkip);
    if (response) {
      const mapTopics = response.data.map((topic) => {
        return {
          ...topic,
          key: topic.id,
        };
      });
      skip.current = response.newSkip;
      setTopics([...topics, ...mapTopics]);
    }
    return [];
  };

  const handleApproved = async (id) => {
    console.log("id:", id);
    const response = await apiApproveTopic(token, id);
    if (response) {
      const { data } = userInfo;
      const newTopics = topics.map((topic) => {
        if (topic.id === id) {
          return {
            ...topic,
            status: "approved",
            approvedBy: {
              id: data.id,
              email: data.email,
              username: data.username,
              role: {
                name: data.role,
                slug: data.role,
              },
            },
          };
        }
        return topic;
      });

      setTopics(newTopics);
    }
  };

  const handleDeleteTopic = async (id) => {
    const response = await apiDeleteTopic(token, id);
    const filterTopics = topics.filter((topic) => topic.id != id);
    if (response) setTopics([...filterTopics]);
  };

  const ButtonBaned = ({ approvedBy }) => (
    <Popover
      content={
        <div>
          <p>
            <span>Approved by</span> {approvedBy?.username} (
            {approvedBy?.role?.name})
          </p>
        </div>
      }
      placement="bottom"
    >
      <Tag className="cursor-pointer" color="green">
        APPROVED
      </Tag>
    </Popover>
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="my-3  border-blue-400 border rounded-lg w-full max-w-[320px] pl-4 flex py-2">
          <input
            className="flex-1 text-sm placeholder:text-sm"
            type="text"
            placeholder="Search slug"
            onChange={handleChangeSearch}
          />
          <div className="mr-4 text-blue-400">{icons.searchIcon}</div>
        </div>
        <Button kind="primary" height="45px" to="/manage/add-topic">
          Create topic
        </Button>
      </div>
      <Table
        dataSource={topics}
        key="id"
        pagination={false}
        className="overflow-y-auto"
      >
        <Column
          title="Name"
          key="name"
          render={(topic) => (
            <p className="font-medium whitespace-nowrap">{topic.name}</p>
          )}
        />
        <Column title="Slug" dataIndex="slug" key="slug" />
        <Column
          title="Crated time"
          key="createdAt"
          render={(topic) => (
            <p className="whitespace-nowrap">{getTimeAgo(topic.createdAt)}</p>
          )}
        />

        <Column
          title="Articles"
          dataIndex="articlesCount"
          key="articlesCount"
        />
        <Column
          title="Followers"
          dataIndex="followersCount"
          key="followersCount"
        />
        <Column
          title="Status"
          key="status"
          render={(topic) =>
            topic.status === "pending" ? (
              <Tag>PENDING</Tag>
            ) : (
              <ButtonBaned approvedBy={topic.approvedBy}></ButtonBaned>
            )
          }
        />

        <Column
          title="Action"
          key="action"
          render={(topic) => (
            <div className="flex items-center text-gray-500 gap-x-3">
              {topic.status === "approved" ? (
                <ActionEdit
                  onClick={() =>
                    navigate(
                      `/manage/update-topic/?id=${topic.id}&name=${topic.name}`
                    )
                  }
                ></ActionEdit>
              ) : (
                <ActionApproved
                  onClick={() => handleApproved(topic.id)}
                ></ActionApproved>
              )}
              <ActionDelete
                onClick={() => handleDeleteTopic(topic.id)}
              ></ActionDelete>
            </div>
          )}
        />
      </Table>
      <div className="flex justify-center mt-5" onClick={handleLoadMore}>
        <Button type="button" kind="primary" height="40px">
          Load more
        </Button>
      </div>
    </div>
  );
};

export default TopicTable;
