/* eslint-disable react/prop-types */
import styled, { css } from "styled-components";

const AvatarStyle = styled.div`
  height: 55px;
  width: 55px;
  ${(props) =>
    props.size === "small" &&
    css`
      height: 40px;
      height: 40px;
    `};
  ${(props) =>
    props.size === "medium" &&
    css`
      height: 55px;
      height: 55px;
    `};
  ${(props) =>
    props.size === "large" &&
    css`
      height: 70px;
      height: 70px;
    `};
  .avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Avatar = ({ url = "", alt = "" }) => {
  return (
    <AvatarStyle>
      <img className="rounded-1/2" src={url} alt={alt} loading="lazy" />
    </AvatarStyle>
  );
};

export default Avatar;
