/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import ButtonFollowingTopic from "../../components/button/ButtonFollowingTopic";
import apiGetTopicFollowersAmount from "../../api/apiGetTopicFollowersAmount";
import apiGetTopicArticlesAmount from "../../api/apiGetTopicArticlesAmount";

const TopicDisplay = ({ topic }) => {
  const [followers, setFollowers] = useState(0);
  const [stories, setStories] = useState(0);

  useEffect(() => {
    async function fetchTopic() {
      try {
        const response = await apiGetTopicFollowersAmount(topic.slug);
        if (response) setFollowers(response.data);
      } catch (error) {
        console.log("error:", error);
      }
    }
    async function fetchBlog() {
      try {
        const response = await apiGetTopicArticlesAmount(topic.slug);
        if (response) setStories(response.data);
      } catch (error) {
        console.log("error:", error);
      }
    }
    fetchBlog();
    fetchTopic();
  }, [topic]);
  if (!topic) return;
  return (
    <>
      <div className="w-full h-[200px] my-12 text-center border-b border-l-stone-300">
        <div className="">
          <h2 className="text-4xl font-bold ">{topic?.name}</h2>
          <div className="flex items-center justify-center my-6 ">
            Topic
            <div className="mx-1 -translate-y-1">.</div>
            {followers} Followers
            <div className="mx-1 -translate-y-1">.</div>
            {stories} Stories
          </div>
          <ButtonFollowingTopic
            slug={topic?.slug}
            initialFollowing={topic?.isFollowed}
          ></ButtonFollowingTopic>
        </div>
      </div>
    </>
  );
};

export default TopicDisplay;
