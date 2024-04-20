import { Popover } from "antd";
import { icons } from "../../utils/constants";
import { apAddAnArticleToReadingList, apiRemoveAnArticleInReadingList } from "../../api/apisHung";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

// eslint-disable-next-line react/prop-types
const ButtonSaveBlog = ({ BlogId, isMyArticle, checkMyProfile }) => {
  const [isSaveList, setIsSaveList] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (typeof checkMyProfile === "boolean") setIsSaveList(checkMyProfile);
  }, [checkMyProfile]);

  const handleSaveList = async () => {
    let response;

    if (!isSaveList) {
      response = await apAddAnArticleToReadingList(token, BlogId);
    } else {
      response = await apiRemoveAnArticleInReadingList(token, BlogId);
    }
    if (response) {
      setIsSaveList(!isSaveList);
      toast.success(response.message, {
        pauseOnHover: false,
        delay: 150,
      });
    }
  };

  return (
    <>
      <Popover placement="leftTop" content={<p>Save to List</p>}>
        {!isMyArticle && (
          <button
            className="flex items-center text-gray-400 hover:text-gray-600"
            onClick={handleSaveList}
          >
            {isSaveList ? icons.savedIcon : icons.saveIcon}
          </button>
        )}
      </Popover>
    </>
  );
};

export default ButtonSaveBlog;
