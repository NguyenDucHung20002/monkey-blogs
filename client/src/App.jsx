/* eslint-disable react/prop-types */
// import { Label, Paragraph, RadioBox, Input } from "./conponents/radioInput/RadioStyled";

import UploadButton from "./conponents/button/UploadButton";

// import TestDropdown from "./conponents/test/TestDropdown";

// import RegisterHook from "./conponents/form/RegisterHook";

function App() {
  return (
    <>
      {/* <TestDropdown></TestDropdown> */}
      {/* <RegisterHook></RegisterHook> */}
      {/* <MyRadio id="london" name="location" value="London"></MyRadio> */}
      <UploadButton></UploadButton>
    </>
  );
}

// const MyRadio = ({ ...props }) => {
//   return (
//     <Label id={props.id || props.name}>
//       <Input type="radio" {...props} />
//       <RadioBox></RadioBox>
//       <Paragraph>{props.value}</Paragraph>
//     </Label>
//   );
// };

export default App;
