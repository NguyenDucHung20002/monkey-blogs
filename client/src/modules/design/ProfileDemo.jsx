/* eslint-disable react/prop-types */
import StickyBox from "react-sticky-box";
import { AddBookMarkIcon, EllipsisIcon } from "../../assets/icon";
import TopicList from "../topic/TopicList";
import timeSince from "../modulesJs/timeAgo";
import BlogImage from "../blog/BlogImage";
import { useContext } from "react";
import ProfileInfo from "../profile/ProfileInfo";
import { DesignContext } from "../../pages/DesignPage";
import { dataDemoBlogs, dataDemoFollowing, dataDemoTopic } from "./dataDemo";

const ProfileDemo = ({ selectedDevice, image }) => {
  const { imageDisplay, showFollowRecommend, user } = useContext(DesignContext);
  const setShow = () => {};

  return (
    <>
      <div className="w-full border-t border-gray-300"></div>
      <div className="overflow-auto container max-w-[1336px] mx-auto flex">
        <div
          className={`${
            selectedDevice !== "desktop"
              ? "w-full"
              : "w-full md:px-14 md:max-w-[70%] "
          } `}
        >
          <div className="">
            <img
              className={`max-h-32 w-full ${imageDisplay?.display} ${imageDisplay?.position}`}
              src={image?.url}
              alt=""
            />
          </div>
          <div className="w-full py-8">
            <div className="w-full h-20 py-4 flex items-center justify-between">
              <div className="text-[25px] text-black py-3 font-bold">
                {user.fullname}
              </div>
              <div className="">
                <EllipsisIcon />
              </div>
            </div>
          </div>
          <div className="w-full flex border-b">
            <div className="py-3">Home</div>
            <div className="p-3">About</div>
          </div>
          {dataDemoBlogs.map((val) => (
            <div key={val.id} className="mt-5 border-b min-h-[165px]">
              <div className="">
                <p className="text-sm">{timeSince(val?.createdAt)}</p>
              </div>
              <div className="flex mt-3">
                <div className="flex-1  max-w-[80%]">
                  {/* <Link to={`/blog/${val.slug}`}> */}
                  <h2 className="pb-1 text-xl min-h-[60px] font-bold">
                    {val.title}
                  </h2>
                  <p
                    className={`${
                      selectedDevice == "mobile"
                        ? "hidden"
                        : "text-base text-gray-400 line-clamp-2"
                    }`}
                  >
                    {val.preview}
                  </p>
                  {/* </Link> */}
                  <div className="flex items-center justify-between py-4">
                    <TopicList
                      data={[val?.topic]}
                      kind={`me/design/${user.username}`}
                    ></TopicList>
                    <div className="flex items-center">
                      <AddBookMarkIcon />
                      <EllipsisIcon />
                    </div>
                  </div>
                </div>
                {val.banner && (
                  <div className="ml-14">
                    <BlogImage
                      className="flex-shrink-0"
                      url={val.banner}
                      alt=""
                      to={`#`}
                    ></BlogImage>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div
          className={`${
            selectedDevice !== "desktop"
              ? "hidden"
              : "hidden flex-1 max-w-[30%] md:block "
          } `}
        >
          <StickyBox>
            <div className="w-full h-screen p-8 text-gray-500 border-l border-l-gray-300 ">
              {user.id && (
                <ProfileInfo
                  show={false}
                  setShow={setShow}
                  user={user}
                  isBlocked={false}
                />
              )}
              {/* <Following data={following} token={token} user={user} /> */}
              {showFollowRecommend?.following ? (
                <div className="w-full">
                  <h2 className="my-3 text-lg font-bold text-black ">
                    Following
                  </h2>
                  <div className="w-full max-h-[200px] overflow-hidden">
                    {dataDemoFollowing.map((val, idx) => (
                      <div
                        key={idx}
                        className="flex content-center justify-between py-2 "
                      >
                        <div className="flex max-w-[90%]">
                          <div className="w-6 h-6 overflow-hidden rounded-1/2 ">
                            <img
                              className="object-cover w-full h-full"
                              src={val.avatar}
                              alt=""
                            />
                          </div>
                          <div className="max-w-[80%] ">
                            <p className="py-1 text-[12px] ml-2 overflow-hidden overflow-ellipsis whitespace-nowrap">
                              {val.fullname}
                            </p>
                          </div>
                        </div>

                        <button className="">
                          <EllipsisIcon />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="py-2 my-3">
                    <button>
                      See all <span>(3)</span>
                    </button>
                  </div>
                </div>
              ) : (
                ""
              )}

              {showFollowRecommend?.recommend ? (
                <div className="pt-3 border-t border-gray-300 bg-gray80">
                  <h2 className="text-black font-bold my-4">
                    Recommended topics
                  </h2>
                  <TopicList
                    className="max-h-[190px] overflow-hidden"
                    data={dataDemoTopic}
                    kind={`me/design/${user.username}`}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          </StickyBox>
        </div>
      </div>
    </>
  );
};

export default ProfileDemo;
