/* eslint-disable react/prop-types */
import { Link, NavLink } from "react-router-dom";
import { Popover, Skeleton } from "antd";
import TopicList from "../topic/TopicList";
import Swal from "sweetalert2";
import BlogImage from "../blog/BlogImage";
import timeAgo from "../modulesJs/timeAgo";
import Avatar from "../user/Avatar";
import ButtonActionBlogsAuthor from "../../components/button/ButtonActionBlogsAuthor";
import ButtonSaveBlog from "../../components/button/ButtonSaveBlog";
import { icons } from "../../utils/constants";

const ProfileBlogs = ({ blogs, user, fetchDeleteArticle }) => {
  const handleDelete = (slug) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        fetchDeleteArticle(slug);
        Swal.fire("Deleted!", "Your post has been deleted.", "success");
      }
    });
  };

  const MoreUser = ({ slug }) => {
    return (
      <div>
        <NavLink to={`/edit-blog/${slug}`}>
          <div className="my-2 ">Edit story</div>
        </NavLink>
        <div
          onClick={() => handleDelete(slug)}
          className="my-2 text-red-500 cursor-pointer"
        >
          Delete story
        </div>
      </div>
    );
  };

  if (blogs.length == 0) {
    return (
      <div className="flex overflow-hidden border rounded-lg bg-neutral-50 mt-11 border-neutral-50">
        <div className="w-2/4 p-4">
          <div className="flex">
            <Avatar url={user?.avatar} size="small"></Avatar>
            <div className="flex items-center justify-between px-2">
              {user?.fullname}
            </div>
          </div>
          <h1 className="py-5 text-xl font-bold">Reading Story</h1>
          <div className="flex justify-between">
            <p className="">No Story</p>
            <button className="text-lg">...</button>
          </div>
        </div>
        <div className="flex w-2/4 bg-white">
          <div className="w-1/2 h-full bg-neutral-200"></div>
          <div className="bg-neutral-200 h-full w-1/3 mx-[2px]"></div>
          <div className="flex-1 h-full bg-neutral-200"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {blogs.map((val) => (
        <div key={val.id} className="mt-5 border-b ">
          <div className="">
            <p className="text-sm">{timeAgo(val?.createdAt)}</p>
          </div>
          <div className="flex mt-3">
            <div className="flex-1  max-w-[80%]">
              <Link to={`/blog/${val.slug}`}>
                <h2 className="pb-1 min-h-[60px] xs:min-h-[30px] text-xl font-bold">
                  {val.title}
                </h2>
                <p className="hidden xs:inline text-base text-gray-400 line-clamp-2">
                  {val.preview}
                </p>
              </Link>
              <div className="flex items-center justify-between py-4">
                <TopicList data={[val?.topic]}></TopicList>
                <div className="flex items-center">
                  <ButtonSaveBlog
                    BlogId={val.id}
                    checkMyProfile={
                      val.isMyProfile ? val.isMyProfile : val.isSaved
                    }
                    isMyArticle={val.isMyArticle}
                  ></ButtonSaveBlog>

                  {user?.isMyProfile ? (
                    <Popover
                      placement="bottom"
                      content={<MoreUser slug={val.id} />}
                      trigger={"click"}
                    >
                      <button className="flex items-center text-gray-400 hover:text-gray-500">
                        {icons.moreIcon}
                      </button>
                    </Popover>
                  ) : (
                    <ButtonActionBlogsAuthor
                      blog={val}
                    ></ButtonActionBlogsAuthor>
                  )}
                </div>
              </div>
            </div>
            {val.banner ? (
              <div className="ml-14">
                <BlogImage
                  className="flex-shrink-0"
                  url={val.banner}
                  alt=""
                  to={`/blog/${val.slug}`}
                ></BlogImage>{" "}
              </div>
            ) : (
              <div className="ml-14">
                <Skeleton.Image
                  active={false}
                  style={{
                    width: "120px",
                    height: "120px",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default ProfileBlogs;
