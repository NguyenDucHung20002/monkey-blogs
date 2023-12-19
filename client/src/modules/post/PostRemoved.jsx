/* eslint-disable react/prop-types */
import { useCallback, useEffect, useRef, useState } from "react";
import { apiGetRemovedArticles, apiRestoreArticle } from "../../api/apisHung";
import { Popover, Table, Tag } from "antd";
import Column from "antd/es/table/Column";
import { Button } from "../../components/button";
import { icons } from "../../utils/constants";
import useTimeAgo from "../../hooks/useTimeAgo";
import { NavLink } from "react-router-dom";

const PostRemoved = () => {
  const [blogReports, setBlogReports] = useState([]);
  console.log("blogReports:", blogReports);
  const token = localStorage.getItem("token");
  const skip = useRef(0);
  const getTimeAgo = useTimeAgo;

  const fetchReports = useCallback(async () => {
    const response = await apiGetRemovedArticles(token, 10);
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
  }, [token]);
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleLoadMore = async () => {
    const newSkip = skip.current;
    const response = await apiGetRemovedArticles(token, 10, newSkip);
    console.log("response:", response);
    if (response) {
      const mapBlogs = response.data.map((user) => {
        return {
          ...user,
          key: user.id,
        };
      });
      skip.current = response.newSkip;
      setBlogReports([...blogReports, ...mapBlogs]);
    }
    return [];
  };

  const handleRestoreArticle = useCallback(
    async (id) => {
      const response = await apiRestoreArticle(token, id);
      if (response) {
        fetchReports();
      }
    },
    [fetchReports, token]
  );

  const ButtonMore = (blog) => (
    <Popover
      placement="leftTop"
      content={
        <>
          <div>
            <div>
              <button
                className="block w-full py-1 text-left hover:text-blue-400"
                onClick={() => handleRestoreArticle(blog.id)}
              >
                Restore this Article
              </button>
            </div>
          </div>
        </>
      }
    >
      <button className="flex items-center justify-center text-blue-400 rounded-md cursor-pointer w-7 h-7">
        {icons.moreIcon}
      </button>
      <div></div>
    </Popover>
  );

  return (
    <>
      <Table
        dataSource={blogReports}
        pagination={false}
        className="overflow-y-auto"
      >
        <Column
          title="Author"
          key="username"
          render={(blog) => (
            <div className="flex items-center gap-2">
              {blog?.author?.userInfo?.role.slug === "user" ? (
                <Tag color="green">{blog?.author?.userInfo?.role.slug}</Tag>
              ) : (
                <Tag color="red">{blog?.author?.userInfo?.role.slug}</Tag>
              )}
              <p className="font-semibold text-gray-500">
                {blog?.author?.userInfo?.username}
              </p>
            </div>
          )}
        />

        <Column
          title="Title"
          key="title"
          render={(blog) => (
            <NavLink to={`/blog-detail/${blog.id}`} target="_blank">
              <p className="w-40 font-medium">{blog.title}</p>
            </NavLink>
          )}
        />

        <Column
          title="Deleted by"
          key="deletedBy"
          render={(blog) => (
            <div className="flex justify-center gap-2">
              <p className="font-semibold text-gray-500">
                {blog.deletedBy.username}
              </p>
              <Tag color="red">{blog?.deletedBy.role.name}</Tag>
            </div>
          )}
        />

        <Column
          title={<p className="whitespace-nowrap">Deleted at</p>}
          key="deletedAt"
          render={(blog) => (
            <p className="font-semibold text-gray-500 whitespace-nowrap">
              {getTimeAgo(blog.deletedAt)}
            </p>
          )}
        />

        <Column
          title="Status"
          key="status"
          render={(blog) =>
            blog.status === "approved" ? (
              <Tag color="green">APPROVED</Tag>
            ) : (
              <Tag color="red">REJECTED</Tag>
            )
          }
        />
        <Column title="Reports" dataIndex="reportsCount" key="reportsCount" />

        <Column title="Rejects" dataIndex="rejectsCount" key="rejectsCount" />

        <Column
          title="Action"
          key="action"
          render={(blog) => ButtonMore(blog)}
        />
      </Table>
      {blogReports && blogReports.length >= 5 && (
        <div className="flex justify-center mt-5" onClick={handleLoadMore}>
          <Button type="button" kind="primary" height="40px">
            Load more
          </Button>
        </div>
      )}
    </>
  );
};

export default PostRemoved;
