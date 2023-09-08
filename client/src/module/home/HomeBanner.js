import React from "react";
import styled from "styled-components";
import { Button } from "../../components/button";

const HomeBannerStyled = styled.div`
  height: 530px;
  padding: 40px 0;
  background-image: linear-gradient(
    to right bottom,
    ${(props) => props.theme.primary},
    ${(props) => props.theme.secondary}
  );
  .banner {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .banner-content {
    max-width: 600px;
    color: white;
  }
  .heading {
    font-size: 36px;
    margin-bottom: 20px;
  }
  .desc {
    line-height: 1.75;
    margin-bottom: 40px;
  }
`;

const HomeBanner = () => {
  return (
    <HomeBannerStyled>
      <div className="container">
        <div className="banner">
          <div className="banner-content">
            <h1 className="heading">Monkey Blogging</h1>
            <p className="desc">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eaque
              expedita culpa, consequatur voluptates explicabo omnis vitae a
              nostrum praesentium quisquam sunt, cupiditate corrupti nulla quasi
              quis enim. Possimus, exercitationem sunt!
            </p>
            <Button to="/sign-up" kind="secondary">
              Get Started
            </Button>
          </div>
          <div className="banner-image">
            <img src="/img/banner.png" alt="banner" />
          </div>
        </div>
      </div>
    </HomeBannerStyled>
  );
};

export default HomeBanner;
