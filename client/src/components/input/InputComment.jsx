/* eslint-disable react/prop-types */
import { Input } from "antd";

const { TextArea } = Input;
const InputComment = ({ valueContent }) => {
  const { value, setValue } = valueContent;

  const handleCancel = () => {
    setValue("");
  };

  if (!valueContent) return;
  return (
    <>
      <TextArea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="What are your thoughts"
        autoSize={{ minRows: 3, maxRows: 3 }}
      />
      <div className="my-4 text-right action">
        <button className="px-3 py-1 rounded-2xl" onClick={handleCancel}>
          Cancel
        </button>
        <button
          type="submit"
          className="px-3 py-1 text-white bg-green-600 rounded-2xl"
        >
          Respond
        </button>
      </div>
    </>
  );
};

export default InputComment;
