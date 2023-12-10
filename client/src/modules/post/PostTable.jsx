/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { apiGetAllArticlesAdmin } from "../../api/apisHung";
import { Popover, Table, Tag } from "antd";
import Column from "antd/es/table/Column";
import useTimeAgo from "../../hooks/useTimeAgo";
import { Link } from "react-router-dom";
import Avatar from "../user/Avatar";

const PostTable = () => {
  const getTimeAgo = useTimeAgo;
  const [blogReports, setBlogReports] = useState([]);
  console.log("blogReports:", blogReports);
  const token = localStorage.getItem("token");
  const skip = useRef(0);

  useEffect(() => {
    async function fetchReports() {
      const response = await apiGetAllArticlesAdmin(token, 5);
      if (response.data) {
        skip.current = response.newSkip;
        const mapBlogs = response.data.map((user) => {
          return {
            ...user,
            key: user.id,
          };
        });
        setBlogReports(mapBlogs);
      }
    }
    fetchReports();
  }, [token]);

  // const handleLoadMore = async () => {
  //   const newSkip = skip.current;
  //   const response = await apiGetAllArticlesAdmin(token, 5, newSkip);
  //   if (response) {
  //     const mapBlogs = response.data.map((user) => {
  //       return {
  //         ...user,
  //         key: user.id,
  //       };
  //     });
  //     skip.current = response.newSkip;
  //     setBlogReports([...blogReports, ...mapBlogs]);
  //   }
  //   return [];
  // };

  const ShowAuthor = ({ author }) => {
    return (
      <Popover
        content={
          <div>
            <Link
              className="flex items-center gap-2"
              to={`/profile/${author?.userInfo?.username}`}
            >
              <Avatar
                className="cursor-pointer"
                size="xs"
                url={author?.avatar}
              />
              <p>
                {author?.userInfo?.username} . {author?.userInfo?.role?.slug}
              </p>
            </Link>
          </div>
        }
        placement="bottom"
      >
        <p className="flex items-end gap-1 text-gray-400 font-semibold hover:text-gray-600">
          {author.fullname}
        </p>
      </Popover>
    );
  };

  return (
    <>
      <Table dataSource={blogReports} pagination={false}>
        <Column
          title="Slug"
          key="slug"
          render={(blog) => (
            <>
              {blog.slug.length > 10 ? (
                <Popover placement="bottomLeft" content={<p>{blog.slug}</p>}>
                  <p className="font-medium whitespace-nowrap">
                    {blog.slug.length > 10 && blog.slug.slice(0, 30) + "..."}
                  </p>
                </Popover>
              ) : (
                <p>{blog.slug}</p>
              )}
            </>
          )}
        />
        <Column
          title="Title"
          key="title"
          render={(blog) => (
            <>
              {blog.title.length > 10 ? (
                <Popover placement="bottomLeft" content={<p>{blog.title}</p>}>
                  <p className="font-medium whitespace-nowrap">
                    {blog.title.length > 10 && blog.title.slice(0, 30) + "..."}
                  </p>
                </Popover>
              ) : (
                <p>{blog.title}</p>
              )}
            </>
          )}
        />
        <Column
          title="Author"
          key="author"
          render={(blog) => (
            <>
              <ShowAuthor author={blog.author}></ShowAuthor>
            </>
          )}
        />
        <Column
          title="Status"
          key="status"
          render={(user) =>
            user.status === "approved" ? (
              <Tag color="green">APPROVED</Tag>
            ) : (
              <Tag color="ref">REJECTED</Tag>
            )
          }
        />
        <Column title="Reports" dataIndex="reportsCount" key="reportsCount" />
        <Column
          title="Crated time"
          key="createdAt"
          render={(blog) => (
            <p className="whitespace-nowrap">{getTimeAgo(blog.createdAt)}</p>
          )}
        />
      </Table>
      {/* {blogReports && blogReports.length >= 5 && (
        <div className="flex justify-center mt-5" onClick={handleLoadMore}>
          <Button type="button" kind="primary" height="40px">
            Load more
          </Button>
        </div>
      )} */}
    </>
  );
};

export default PostTable;
