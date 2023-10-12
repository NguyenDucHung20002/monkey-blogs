import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useForm, useWatch } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import UpdateProfile from "../components/form/UpdateProfile";
import ProfileInfor from "../modules/profile/ProfileInfor";
import ProfileContext from "../modules/profile/ProfileContext";
import { useAuth } from "../contexts/auth-context";
import { config } from "../utils/constants";
import Following from "../components/follow/Following";
import TopicRcmm from "../modules/topic/TopicRcm";
import ArticleList from "../modules/article/ArticleList";
import { useParams } from "react-router-dom";
const ProfilePage = () => {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({});
  const [isFollow, setIsFollow] = useState(false);
  const { userInfo, setUserInfo } = useAuth();
  const { username } = useParams();
  console.log(user);
  const token = localStorage.getItem("token");
  console.log(token);
  const FetchFollow = async () => {
    const res = await axios
      .post(
        `${config.SERVER_HOST}:${config.SERVER_PORT}/api/follow-user/${username}/follow-unfollow`,
        {},
        {
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .catch((err) => {
        console.log(err);
      });
    if (res.data.success) {
      console.log("res.data.success:", res.data.success);
      setIsFollow(!isFollow);
    }
  };

  useEffect(() => {
    async function fetch() {
      const res = await axios
        .get(
          `${config.SERVER_HOST}:${config.SERVER_PORT}/api/user/${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .catch((err) => {
          console.log(err);
        });
      if (res.data.success) {
        const profileUser = res.data.data;
        setUser({ ...profileUser });
        setIsFollow(profileUser.isFollowing);
      }
    }
    fetch();
  }, [show, username]);
  return (
    <>
      <div className="w-full border-t border-gray-300"></div>
      {user.isMyProfile && (
        <UpdateProfile user={user} show={show} setShow={setShow} />
      )}
      <div className="container max-w-[1336px] mx-auto flex">
        <div className="w-full md:px-14 md:max-w-[70%] ">
          <ProfileContext user={user} />
          {/* <ArticleList className="gap-8 md:grid-cols-1 lg:grid-cols-2"/> */}
        </div>
        <div className=" hidden max-w-[30%] md:block  ">
          <div className="w-full h-screen p-8 text-gray-500 border-l border-l-gray-300 ">
            <ProfileInfor
              show={show}
              setShow={setShow}
              user={user}
              isFollow={isFollow}
              FetchFollow={FetchFollow}
            />
            {/* <Following/> */}
            <TopicRcmm />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;

const ProfilePageStyle = styled.div`
  .container {
    max-width: 1200px;
    margin: auto;
  }
`;
