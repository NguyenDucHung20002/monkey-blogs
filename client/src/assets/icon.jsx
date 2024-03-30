import PropTypes from "prop-types";
export const DesktopIcon = ({ onclick, isActive = false }) => (
  <svg
    width="19"
    height="16"
    viewBox="0 0 19 16"
    onClick={onclick}
    fill={isActive ? "#000000" : "#6B6B6B"}
    cursor={"pointer"}
  >
    <path d="M18 .45c-.3-.3-.65-.45-1.08-.45H1.54C1.12 0 .75.15.45.45.15.75 0 1.12 0 1.54V12c0 .42.15.79.45 1.09.3.3.67.45 1.09.45h5.23c0 .24-.05.5-.15.75-.1.25-.21.48-.31.67-.1.2-.16.33-.16.42 0 .17.06.32.19.44a.6.6 0 0 0 .43.18h4.92a.6.6 0 0 0 .44-.18.59.59 0 0 0 .18-.44c0-.08-.05-.22-.16-.41-.1-.2-.2-.43-.3-.69-.1-.26-.16-.5-.16-.74h5.23c.43 0 .79-.15 1.09-.45.3-.3.45-.67.45-1.09V1.54c0-.42-.15-.79-.45-1.09zm-.77 9.09a.3.3 0 0 1-.1.21.3.3 0 0 1-.2.1H1.52a.3.3 0 0 1-.2-.1.3.3 0 0 1-.1-.21v-8a.3.3 0 0 1 .1-.22.3.3 0 0 1 .2-.09h15.4a.3.3 0 0 1 .2.1c.07.05.1.13.1.2v8z"></path>
  </svg>
);
DesktopIcon.propTypes = {
  isActive: PropTypes.bool,
  onclick: PropTypes.func,
};

export const TabletIcon = ({ onclick, isActive = false }) => (
  <svg
    width="14"
    height="17"
    viewBox="0 0 14 17"
    onClick={onclick}
    fill={isActive ? "#000000" : "#6B6B6B"}
    cursor={"pointer"}
  >
    <path d="M11.78.43H1.68C.87.43.22 1.08.22 1.88v13.36c0 .8.65 1.44 1.44 1.44h10.11c.8 0 1.45-.64 1.45-1.44V1.88c0-.8-.65-1.45-1.45-1.45zM6.73 15.9a.62.62 0 1 1 0-1.24.62.62 0 0 1 0 1.24zm5.23-2.18c0 .17-.14.32-.31.32H1.81a.32.32 0 0 1-.32-.32V1.98c0-.17.14-.31.32-.31h9.84c.17 0 .31.14.31.31v11.73z"></path>
  </svg>
);
TabletIcon.propTypes = {
  isActive: PropTypes.bool,
  onclick: PropTypes.func,
};
export const MobileIcon = ({ onclick, isActive = false }) => (
  <svg
    width="10"
    height="17"
    viewBox="0 0 10 17"
    onClick={onclick}
    fill={isActive ? "#000000" : "#6B6B6B"}
    cursor={"pointer"}
  >
    <path d="M8.12.43H1.4C.75.43.23.96.23 1.6v13.67c0 .64.52 1.16 1.16 1.16h6.73c.65 0 1.17-.52 1.17-1.16V1.6C9.29.96 8.77.43 8.12.43zm-5.02.71h3.32c.09 0 .15.13.15.28 0 .16-.06.28-.15.28H3.1c-.09 0-.15-.12-.15-.28 0-.15.06-.28.15-.28zm1.66 14.14a.74.74 0 1 1 0-1.49.74.74 0 0 1 0 1.5zm3.66-2.54H1.1V2.4h7.32v10.34z"></path>
  </svg>
);
MobileIcon.propTypes = {
  isActive: PropTypes.bool,
  onclick: PropTypes.func,
};

export const ArrowLeftIcon = ({ width = "26px", height = "26px" }) => (
  <svg
    className=" cursor-pointer"
    width={width}
    height={height}
    viewBox="0 0 19 19"
    fill="#242424"
  >
    <path
      d="M11.47 13.97L6.99 9.48 11.47 5l.55.5-3.99 3.98 4 4z"
      fillRule="evenodd"
    ></path>
  </svg>
);
ArrowLeftIcon.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
};

export const ArrowRightIcon = ({ width = "26px", height = "26px" }) => (
  <svg
    className="arrow-right-19px_svg__svgIcon-use"
    width={width}
    height={height}
    viewBox="0 0 19 19"
    fill="#242424"
  >
    <path
      d="M7.6 5.14l4.43 4.36-4.43 4.36-.55-.55 3.8-3.81-3.8-3.8"
      fillRule="evenodd"
    ></path>
  </svg>
);
ArrowRightIcon.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
};

export const EllipsisIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.39 12c0 .55.2 1.02.59 1.41.39.4.86.59 1.4.59.56 0 1.03-.2 1.42-.59.4-.39.59-.86.59-1.41 0-.55-.2-1.02-.6-1.41A1.93 1.93 0 0 0 6.4 10c-.55 0-1.02.2-1.41.59-.4.39-.6.86-.6 1.41zM10 12c0 .55.2 1.02.58 1.41.4.4.87.59 1.42.59.54 0 1.02-.2 1.4-.59.4-.39.6-.86.6-1.41 0-.55-.2-1.02-.6-1.41a1.93 1.93 0 0 0-1.4-.59c-.55 0-1.04.2-1.42.59-.4.39-.58.86-.58 1.41zm5.6 0c0 .55.2 1.02.57 1.41.4.4.88.59 1.43.59.57 0 1.04-.2 1.43-.59.39-.39.57-.86.57-1.41 0-.55-.2-1.02-.57-1.41A1.93 1.93 0 0 0 17.6 10c-.55 0-1.04.2-1.43.59-.38.39-.57.86-.57 1.41z"
      fill="currentColor"
    ></path>
  </svg>
);

export const AddBookMarkIcon = () => (
  <svg className="" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M17.5 1.25a.5.5 0 0 1 1 0v2.5H21a.5.5 0 0 1 0 1h-2.5v2.5a.5.5 0 0 1-1 0v-2.5H15a.5.5 0 0 1 0-1h2.5v-2.5zm-11 4.5a1 1 0 0 1 1-1H11a.5.5 0 0 0 0-1H7.5a2 2 0 0 0-2 2v14a.5.5 0 0 0 .8.4l5.7-4.4 5.7 4.4a.5.5 0 0 0 .8-.4v-8.5a.5.5 0 0 0-1 0v7.48l-5.2-4a.5.5 0 0 0-.6 0l-5.2 4V5.75z"
      fill="#000"
    ></path>
  </svg>
);

export const ImageIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect
      x="1.36"
      y="1.28"
      width="11.98"
      height="11.94"
      rx="1.5"
      fill="#fff"
      fillOpacity="0.96"
      stroke="#A8A8A8"
    ></rect>
    <path
      d="M5.9 10.75l3.77-3.77 2.76 2.76.65 2.38a.97.97 0 0 1-.35.58c-.24.21-.54.33-.77.33h-9.4a.94.94 0 0 1-.66-.33 1.17 1.17 0 0 1-.3-.62l.7-1.39 1.42-1.42 1.48 1.48.35.35.35-.35zM6.2 6.46a.86.86 0 1 1-1.72 0 .86.86 0 0 1 1.71 0z"
      fill="#A8A8A8"
      stroke="#A8A8A8"
    ></path>
  </svg>
);

export const UploadIcon = () => (
  <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
    <path
      d="M9.22 6.1v2.72a.4.4 0 0 1-.4.4H1.18a.4.4 0 0 1-.39-.4V6.11H0v2.71C0 9.47.53 10 1.17 10h7.66C9.47 10 10 9.47 10 8.82V6.11h-.78z"
      fill="#006AF5"
    ></path>
    <path
      d="M5 0L2.57 2.44l.56.56L4.6 1.5v6.1h.78V1.5L6.88 3l.55-.56L5 .01z"
      fill="#006AF5"
    ></path>
  </svg>
);
