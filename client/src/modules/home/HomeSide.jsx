// eslint-disable-next-line no-unused-vars
import React from "react";
import TopicList from "../topic/TopicList";
import styled from "styled-components";
const HomeSideStyle = styled.div`
  padding: 30px 0 0 30px;
  min-height: calc(100vh - 70px);

  .home-side {
    max-width: 400px;
    width: 100%;
  }
`;

const topics = [
  { name: "Hentai", slug: "hentai" },
  { name: "Echi", slug: "echi" },
];

const HomeSide = () => {
  return (
    <HomeSideStyle className="border-l border-gray-300">
      <div className="home-side">
        <TopicList
          className="mt-5"
          data={topics}
          title="Recommended topics"
        ></TopicList>
      </div>
    </HomeSideStyle>
  );
};

export default HomeSide;
