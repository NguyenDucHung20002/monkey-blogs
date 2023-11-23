/* eslint-disable no-unused-vars */
import { useForm } from "react-hook-form";
import DashboardHeading from "../dashboard/DashboardHeading";
import { Field } from "../../components/field";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
import { Button } from "../../components/button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/auth-context";
import { config } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const schema = yup.object({
  name: yup.string().required("Please fill out your name topic"),
});

const TopicAddNew = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const arrErorrs = Object.values(errors);
    if (arrErorrs.length > 0) {
      toast.error(arrErorrs[0]?.message, {
        pauseOnHover: false,
        delay: 500,
      });
    }
  }, [errors]);

  const handleAddTopic = ({ name }) => {
    console.log("name:", name);
    if (!isValid) return;
    async function fetchAddTopic() {
      if (!token) return;
      try {
        const response = await axios.post(
          `${config.SERVER_HOST}/topic`,
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
          reset();
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
          Add new topic
        </Button>
      </form>
    </div>
  );
};

export default TopicAddNew;
