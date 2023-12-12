/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { apiGetAllArticlesAdmin } from "../../api/apisHung";
import { Popover, Select, Table, Tag } from "antd";
import Column from "antd/es/table/Column";
import useTimeAgo from "../../hooks/useTimeAgo";
import { Link } from "react-router-dom";
import { Button } from "../../components/button";
import { debounce } from "lodash";
import { icons } from "../../utils/constants";

const PostTable = () => {
  const getTimeAgo = useTimeAgo;
  const [blogReports, setBlogReports] = useState([]);
  const token = localStorage.getItem("token");
  const [searchBlogs, setSearchBlogs] = useState("");
  const [status, setStatus] = useState("");
  const skip = useRef(0);

  const handleChangeSearch = debounce((e) => {
    setSearchBlogs(e.target.value);
  }, 200);

  useEffect(() => {
    async function fetchReports() {
      const response = await apiGetAllArticlesAdmin(
        token,
        10,
        searchBlogs,
        status
      );
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
  }, [token, searchBlogs, status]);

  const handleLoadMore = async () => {
    const newSkip = skip.current;
    const response = await apiGetAllArticlesAdmin(
      token,
      10,
      searchBlogs,
      status,
      newSkip
    );
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

  const ShowAuthor = ({ author }) => {
    return (
      <Popover
        content={
          <div>
            <Link
              className="flex items-center gap-2"
              to={`/profile/${author?.userInfo?.username}`}
            >
              <p>
                {author?.userInfo?.username} . {author?.userInfo?.role?.slug}
              </p>
            </Link>
          </div>
        }
        placement="bottom"
      >
        <p className="flex items-end gap-1 font-semibold text-gray-400 hover:text-gray-600">
          {author.fullname}
        </p>
      </Popover>
    );
  };

  const handleChange = (value) => {
    setStatus(value);
  };

  return (
    <>
      <div className="flex items-center gap-5">
        <div className="my-3 border-gray-300 hover:border-blue-400 text-gray-300 hover:text-blue-400 transition-all border rounded-lg w-full max-w-[320px] pl-4 flex py-1">
          <input
            className="flex-1 text-sm text-gray-500 placeholder:text-sm "
            type="text"
            placeholder="Search slug"
            onChange={handleChangeSearch}
          />
          <div className="flex items-center mr-3 ">{icons.searchIcon}</div>
        </div>
        <Select
          defaultValue="Status"
          style={{ width: "120px" }}
          onChange={handleChange}
          options={[
            { value: "approved", label: "Approved" },
            { value: "pending", label: "Pending" },
            { value: "rejected", label: "Rejected" },
          ]}
        />
      </div>
      <Table
        dataSource={blogReports}
        pagination={false}
        className="overflow-y-auto"
      >
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
              <Tag color="red">REJECTED</Tag>
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

export default PostTable;
