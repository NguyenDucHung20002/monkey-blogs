// eslint-disable-next-line no-unused-vars
import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
const BlogImageStyles = styled.div`
  max-width: 112px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: inherit;
  }
`;

// eslint-disable-next-line react/prop-types
const PostImage = ({ className = "", url = "", alt = "", to = "" }) => {
  if (to)
    return (
      <NavLink to={to} style={{ display: "block" }}>
        <BlogImageStyles className={`post-image ${className}`}>
          <img src={url} alt={alt} loading="lazy" />
        </BlogImageStyles>
      </NavLink>
    );
  return (
    <BlogImageStyles className={`post-image ${className}`}>
      <img src={url} alt={alt} loading="lazy" />
    </BlogImageStyles>
  );
};

export default PostImage;
