import React from "react";
import styled from "styled-components";

const FieldStyled = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  margin-bottom: 40px;

  &:last-child {
    margin-bottom: 0px;
  }
`;

const Field = ({ children }) => {
  return <FieldStyled>{children}</FieldStyled>;
};

export default Field;
