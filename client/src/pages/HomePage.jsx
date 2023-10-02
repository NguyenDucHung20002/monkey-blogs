// eslint-disable-next-line no-unused-vars
import React, { Fragment, useState } from "react";
import StickyBox from "react-sticky-box";
import styled from "styled-components";
import { Col, Row } from "antd";
import HomeMain from "../modules/home/HomeMain";
import HomeSide from "../modules/home/HomeSide";
import Layout from "../layout/Layout";

const HomePageStyle = styled.div``;

const HomePage = () => {
  return (
    <HomePageStyle>
      <Layout>
        <div className="w-full border-t border-gray-300"></div>
        <Row className="px-5 ">
          <Col span={16}>
            <HomeMain></HomeMain>
          </Col>
          <Col span={8}>
            <StickyBox>
              <HomeSide></HomeSide>
            </StickyBox>
          </Col>
        </Row>
      </Layout>
    </HomePageStyle>
  );
};

export default HomePage;
