/* eslint-disable react/prop-types */
import { Avatar } from "antd";
import useTimeAgo from "../../hooks/useTimeAgo";
import BlogImage from "./BlogImage";
import { Link, NavLink } from "react-router-dom";
import BlogMeta from "./BlogMeta";
import BlogTitle from "./BlogTitle";

const BlogGird = ({ blog }) => {
  const { title, preview, img, slug, author, createdAt } = blog;
  const getTimeAgo = useTimeAgo(createdAt);
  return (
    <div className="flex flex-col items-start justify-between ">
      <div className="flex-1">
        <BlogImage
          kind="gird"
          url={img}
          alt=""
          to={`/blog/${slug}`}
        ></BlogImage>
        <div className="my-4">
          <div className="flex py-2">
            <Link to={`/profile/${author?.username}`}>
              <Avatar
                className="cursor-pointer"
                size="small"
                src={<img src={author?.avatar} alt="avatar" />}
              />
            </Link>
            <div className="flex ml-2">
              <BlogMeta
                authorName={author?.fullname}
                date={createdAt}
                to={author?.username}
              ></BlogMeta>
            </div>
          </div>
          <BlogTitle to={`/blog/${slug}`} size="normal">
            {title}
          </BlogTitle>
          <NavLink to={`/blog/${slug}`}>
            <p className="mt-2 text-base text-gray-400 line-clamp-2">
              {preview}
            </p>
          </NavLink>
        </div>
      </div>

      <p className="font-medium text-gray-600">{getTimeAgo}</p>
    </div>
  );
};

export default BlogGird;
