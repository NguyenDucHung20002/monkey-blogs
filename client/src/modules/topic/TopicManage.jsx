// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import DashboardHeading from "../dashboard/DashboardHeading";
import Button from "../../components/button/Button";
import ActionEdit from "../../action/ActionEdit";
import ActionDelete from "../../action/ActionDelete";
import { Table } from "../../components/table";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { config } from "../../utils/constants";
import axios from "axios";

const TopicManage = () => {
  const navigate = useNavigate();
  const [topcis, setTopics] = useState([]);
  useEffect(() => {
    async function fetchTopic() {
      try {
        const response = await axios.get(
          `${config.SERVER_HOST}:${config.SERVER_PORT}/api/topic`,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data) setTopics(response.data.data);
      } catch (error) {
        toast.error("Some thing was wrong!", {
          pauseOnHover: false,
          delay: 500,
        });
      }
    }
    fetchTopic();
  }, []);

  const handleDeleteTopic = (value) => {
    console.log("value:", value);
  };

  return (
    <div>
      <DashboardHeading title="Topics" desc="Manage your topics">
        <Button kind="primary" height="50px" to="/manage/add-topic">
          Create topic
        </Button>
      </DashboardHeading>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Slug</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {topcis &&
            topcis.length > 0 &&
            topcis.map((topic, index) => (
              <tr key={index}>
                <td>{topic._id}</td>
                <td>{topic.name}</td>
                <td>
                  <span className="italic text-gray-400">{topic.slug}</span>
                </td>
                <td>
                  <div className="flex items-center text-gray-500 gap-x-3">
                    <ActionEdit
                      onClick={() =>
                        navigate(`/manage/update-topic/${topic.slug}`)
                      }
                    ></ActionEdit>
                    <ActionDelete
                      onClick={() => handleDeleteTopic(topic.slug)}
                    ></ActionDelete>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TopicManage;
