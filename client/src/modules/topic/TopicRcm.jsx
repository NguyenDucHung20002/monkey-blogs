/* eslint-disable react/prop-types */
import TopicList from "./TopicList";

const TopicRcmm = ({ data = [] }) => {
  if (!data) return;
  return (
    <>
      <div className="pt-3 border-t border-gray-300 bg-gray80">
        <h2 className="text-black font-bold my-4">Recommended topics</h2>
        <TopicList className="max-h-[190px] overflow-hidden" data={data} />
        <button className="text-stone-500 text-sm hover:text-black duration-300 my-3">
          See more topics
        </button>
      </div>
    </>
  );
};

export default TopicRcmm;
