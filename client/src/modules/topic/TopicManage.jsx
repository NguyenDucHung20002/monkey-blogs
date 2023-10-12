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
import Swal from "sweetalert2";

const TopicManage = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const token = localStorage.getItem("token");
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

  const topicDeleted = (slug) => {
    const topicDeleted = topics.filter((topic) => topic.slug !== slug);
    setTopics(topicDeleted);
  };

  const handleDeleteTopic = (value) => {
    async function fetchAddTopic() {
      if (!token) return;
      try {
        const response = await axios.delete(
          `${config.SERVER_HOST}:${config.SERVER_PORT}/api/topic/${value}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          toast.success("Add successfully!", {
            pauseOnHover: false,
            delay: 500,
          });
          topicDeleted(value);
        }
      } catch (error) {
        if (error.response.status === 409)
          return Swal.fire(
            "Deleted!",
            "Your post has been deleted.",
            "success"
          );

        toast.error("Some thing was wrong!", {
          pauseOnHover: false,
          delay: 500,
        });
      }
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetchAddTopic();
      } else {
        Swal.fire("Failed!", "You have no right to delete post", "warning");
      }
    });
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
          {topics &&
            topics.length > 0 &&
            topics.map((topic, index) => (
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
