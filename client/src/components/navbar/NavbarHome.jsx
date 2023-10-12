import { NavLink } from "react-router-dom";
import styled from "styled-components";

const NavbarHomeStyle = styled.div`
  margin: 0 20px 20px;
  display: flex;
  align-items: center;
  gap: 30px;
  border-bottom: 1px solid ${(props) => props.theme.grayF1};
  .menu-item {
    display: inline-block;
    color: ${(props) => props.theme.black};
    padding-bottom: 20px;
    cursor: pointer;
    &.active {
      color: ${(props) => props.theme.secondary};
      border-bottom: 1px solid ${(props) => props.theme.secondary};
    }
    &:hover {
      color: ${(props) => props.theme.secondary};
    }
  }
`;

const navHome = [
  {
    title: "For you",
    url: "/",
  },
  {
    title: "Following",
    url: "/following",
  },
];

const NavbarHome = () => {
  return (
    <NavbarHomeStyle>
      {navHome.map((link) => {
        if (link.onClick)
          return (
            <div className="menu-item" onClick={link.onClick} key={link.title}>
              <span className="menu-text ">{link.title}</span>
            </div>
          );
        return (
          <NavLink to={link.url} className="menu-item" key={link.title}>
            <span className="menu-text">{link.title}</span>
          </NavLink>
        );
      })}
    </NavbarHomeStyle>
  );
};

export default NavbarHome;
