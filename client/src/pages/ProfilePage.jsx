
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components"; 
import {useForm, useWatch} from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import axios from "axios"
import  UpdateProfile  from "../components/form/UpdateProfile";
import { Col, Row } from "antd";
import StickyBox from "react-sticky-box";
import HomeMain from "../modules/home/HomeMain";
import HomeSide from "../modules/home/HomeSide";
import ProfileInfor from "../modules/profile/ProfileInfor";
const ProfilePage = () => {

  return (<>
      <div className="container mx-auto">
        <Row>
          <Col span={16}></Col>
          <Col span={8}>
            <ProfileInfor/>
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