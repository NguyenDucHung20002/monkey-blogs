import TopicSlider from "../modules/topic/TopicSlider";
import TopicDisplay from "../modules/topic/TopicDisplay";
import ArticleList from "../modules/article/ArticleList";
import { useParams } from "react-router-dom";
import ShowAllTopic from "../modules/topic/ShowAllTopic";

const TopicPage = () => {
  const {slug}= useParams()
  return (
    <>
      <div className="container w-full border-t border-gray-300"></div>
      <div className="max-w-[1200px] mx-auto">
        <TopicSlider slug={slug}/>
        <TopicDisplay slug={slug} />
        {slug=='Explore-topics'?(
          <ShowAllTopic/>
        ):(
          <ArticleList className='gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3'/>
        )}
      </div>
    </>
  );
};

export default TopicPage;
