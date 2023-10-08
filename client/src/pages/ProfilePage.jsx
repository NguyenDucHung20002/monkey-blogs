
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useForm, useWatch } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import axios from "axios"
import UpdateProfile from "../components/form/UpdateProfile";
import { Col, Row } from "antd";
import ProfileInfor from "../modules/profile/ProfileInfor";
import ProfileContext from "../modules/profile/ProfileContext";
import { useAuth } from "../contexts/auth-context";
import { config } from "../utils/constants";
const ProfilePage = () =>
{
  const [show, setShow] = useState(false)
  const [ user, setUser ] = useState({
    avatar:""
  });
  const token =localStorage.getItem('token')
  useEffect(()=>{
    async function fetch(){
      const res= await axios.get(`${config.SERVER_HOST}:${config.SERVER_PORT}/api/profile`,{
        headers:{
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      }).catch((err)=>{
        console.log(err);
      })
      if(res.data.success){
        const profileUser = res.data.data.profile;
        setUser({...profileUser,"avatar":`${config.SERVER_HOST}:${config.SERVER_PORT}/api/file/${profileUser.avatar}`})
      }
    }
    fetch();
  },[show])
  return (<>
    <div className="w-full border-t border-gray-300"></div>
      <UpdateProfile show={show} setShow={setShow}/>
    <div className="container mx-auto">
      <Row>
        <Col span={16}>
          <ProfileContext user={user} />
        </Col>
        <Col span={8}>
          <ProfileInfor show={show} setShow={setShow} user={user}/>
        </Col>
      </Row>
    </div>
  </>)
};

export default ProfilePage;


const ProfilePageStyle = styled.div`
  .container{
    max-width: 1200px;
    margin: auto;
  }
`