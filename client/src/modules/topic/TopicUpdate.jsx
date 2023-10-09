/* eslint-disable no-unused-vars */
import { useForm } from "react-hook-form";
import DashboardHeading from "../dashboard/DashboardHeading";
import { Field } from "../../components/field";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
import { Button } from "../../components/button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { config } from "../../utils/constants";
import axios from "axios";
import { useParams } from "react-router-dom";

const schema = yup.object({
  name: yup.string().required("Please fill out your name topic"),
});

const TopicUpdate = () => {
  const token = localStorage.getItem("token");
  const { slug } = useParams();
  const {
    control,
    setValue,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const [topic, setTopic] = useState({});

  useEffect(() => {
    const arrErorrs = Object.values(errors);
    if (arrErorrs.length > 0) {
      toast.error(arrErorrs[0]?.message, {
        pauseOnHover: false,
        delay: 500,
      });
    }
  }, [errors]);

  useEffect(() => {
    if (!slug) return;
    async function fetchATopic() {
      try {
        const response = await axios.get(
          `${config.SERVER_HOST}:${config.SERVER_PORT}/api/topic/${slug}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) setTopic(response.data.data.topic);
        console.log("Topic:", topic);
        const name = topic.name;
        reset({
          name,
        });
      } catch (error) {
        toast.error("Some thing was wrong!", {
          pauseOnHover: false,
          delay: 500,
        });
      }
    }

    fetchATopic();
  }, [reset, slug, token, topic.name]);

  const handleAddTopic = ({ name }) => {
    if (!isValid) return;
    async function fetchAddTopic() {
      if (!token) return;
      if (!topic) return;
      try {
        const response = await axios.put(
          `${config.SERVER_HOST}:${config.SERVER_PORT}/api/topic/${topic.slug}`,
          { name },
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
        }
      } catch (error) {
        if (error.response.status === 409)
          return toast.error(error.response.data.message, {
            pauseOnHover: false,
            delay: 500,
          });

        toast.error("Some thing was wrong!", {
          pauseOnHover: false,
          delay: 500,
        });
      }
    }
    fetchAddTopic();
  };

  return (
    <div>
      <DashboardHeading
        title="New topic"
        desc="Add new topic"
      ></DashboardHeading>
      <form onSubmit={handleSubmit(handleAddTopic)} autoComplete="off">
        <div className="form-layout">
          <Field>
            <Label>Name</Label>
            <Input
              control={control}
              name="name"
              placeholder="Enter your topic name"
            ></Input>
          </Field>
        </div>
        <Button type="submit" height="50px" kind="primary" className="mx-auto">
          Edit Topic
        </Button>
      </form>
    </div>
  );
};

export default TopicUpdate;
