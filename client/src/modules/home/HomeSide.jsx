// eslint-disable-next-line no-unused-vars
import React from "react";
import TopicList from "../topic/TopicList";
import styled from "styled-components";
const HomeSideStyle = styled.div`
  padding-top: 30px;
  min-height: calc(100vh - 70px);
  .home-side {
    max-width: 400px;
    width: 100%;
    margin: 0 auto;
  }
`;

const HomeSide = () => {
  return (
    <HomeSideStyle className="border-l border-gray-300">
      <div className="home-side">
        <TopicList></TopicList>
        <TopicList className="mt-5" title="Recommended topics"></TopicList>
        <TopicList className="mt-5" title="Recommended topics"></TopicList>
        <TopicList className="mt-5" title="Recommended topics"></TopicList>
        <TopicList className="mt-5" title="Recommended topics"></TopicList>
        <TopicList className="mt-5" title="Recommended topics"></TopicList>
        <TopicList className="mt-5" title="Recommended topics"></TopicList>
        <TopicList className="mt-5" title="Recommended topics"></TopicList>
        <TopicList className="mt-5" title="Recommended topics"></TopicList>
        <TopicList className="mt-5" title="Recommended topics"></TopicList>
        <TopicList className="mt-5" title="Recommended topics"></TopicList>
        <TopicList className="mt-5" title="Recommended topics"></TopicList>
        <TopicList className="mt-5" title="Recommended topics"></TopicList>
        <TopicList className="mt-5" title="Recommended topics"></TopicList>
        <TopicList className="mt-5" title="Recommended topics"></TopicList>
        <TopicList className="mt-5" title="Recommended topics"></TopicList>
        <TopicList className="mt-5" title="Recommended topics"></TopicList>
      </div>
    </HomeSideStyle>
  );
};

export default HomeSide;
