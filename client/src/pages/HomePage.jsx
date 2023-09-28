// eslint-disable-next-line no-unused-vars
import React, { Fragment, useState } from "react";

import styled from "styled-components";
import { Col, Row } from "antd";
import HomeMain from "../modules/home/HomeMain";
import HomeSide from "../modules/home/HomeSide";
import Layout from "../layout/Layout";
const HomePageStyle = styled.div``;

const HomePage = () => {
  // const [searchParams, setSearchParams] = useSearchParams();
  // console.log('searchParams.get("token"):', searchParams.get("token"));
  // const [userData, setUserData] = useState({});

  // useEffect(() => {
  //   if (!searchParams) return;
  //   async function fetchData() {
  //     const request = await axios({
  //       method: "get",
  //       url: "http://localhost:8080/api/auth/login-success",
  //       headers: {
  //         Authorization: "Bearer " + searchParams.get("token"),
  //       },
  //     });
  //     console.log("request?.data?.data:", request?.data?.data);
  //     if (request?.data?.success) {
  //       setUserData(request?.data?.data);
  //       setSearchParams("");
  //     }
  //   }
  //   fetchData();
  // }, []);

  return (
    <HomePageStyle>
      <Layout>
        <div className="w-full border-t border-gray-300"></div>
        <Row>
          <Col span={16}>
            <HomeMain></HomeMain>
          </Col>
          <Col span={8}>
            <HomeSide></HomeSide>
          </Col>
        </Row>
      </Layout>
    </HomePageStyle>
  );
};

export default HomePage;
