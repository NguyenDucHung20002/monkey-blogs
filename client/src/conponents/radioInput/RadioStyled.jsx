import styled from "styled-components";

export const Label = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

export const Paragraph = styled.p`
  color: #334680;
  font-size: 0.875rem;
  line-height: 1.313rem;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  margin-left: 0.2rem;
  cursor: pointer;
  user-select: none;
`;

export const RadioBox = styled.div`
  height: 1.125rem;
  width: 1.125rem;
  border: 1px solid #b9bdcf;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: 0.4rem;
  transition: background 0.15s, border-color 0.15s;
  padding: 2px;

  &::after {
    content: "";
    width: 100%;
    height: 100%;
    display: block;
    background: #2266dc;
    border-radius: 50%;
    cursor: pointer;
    transform: scale(0);
  }
`;

export const Input = styled.input`
  display: none;
  &:checked + ${RadioBox} {
    &::after {
      transform: scale(1);
    }
  }
`;
