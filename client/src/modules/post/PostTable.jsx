/* eslint-disable react/prop-types */
import { useCallback, useEffect, useRef, useState } from "react";
import {
  apiGetAllArticlesAdmin,
  apiSetApproved,
  apiSetBackToDraft,
} from "../../api/apisHung";
import { Popover, Select, Table, Tag } from "antd";
import Column from "antd/es/table/Column";
import { Button } from "../../components/button";
import { debounce } from "lodash";
import { icons } from "../../utils/constants";
import { apiDeleteAdminArticle } from "../../api/api";
import { NavLink } from "react-router-dom";

const PostTable = () => {
  const [blogReports, setBlogReports] = useState([]);
  console.log("blogReports:", blogReports);
  const token = localStorage.getItem("token");
  const [searchBlogs, setSearchBlogs] = useState("");
  const [status, setStatus] = useState("");
  const skip = useRef(0);

  const handleChangeSearch = debounce((e) => {
    setSearchBlogs(e.target.value);
  }, 200);

  const fetchReports = useCallback(async () => {
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
  }, [searchBlogs, status, token]);
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

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

  const handleChange = (value) => {
    setStatus(value);
  };

  const handleSetBackToDraft = useCallback(
    async (id) => {
      const response = await apiSetBackToDraft(token, id);
      if (response) {
        fetchReports();
      }
    },
    [fetchReports, token]
  );

  const handleRemoveArticle = useCallback(
    async (id) => {
      const response = await apiDeleteAdminArticle(token, id);
      if (response) {
        fetchReports();
      }
    },
    [fetchReports, token]
  );
  const handleSetApproved = useCallback(
    async (id) => {
      const response = await apiSetApproved(token, id);
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
                onClick={() => handleSetBackToDraft(blog.id)}
              >
                Set Back To Draft
              </button>
            </div>
            <div>
              <button
                className="block w-full py-1 text-left hover:text-blue-400"
                onClick={() => handleRemoveArticle(blog.id)}
              >
                Remove this Article
              </button>
            </div>
            {blog.status === "rejected" && (
              <div>
                <button
                  className="block w-full py-1 text-left hover:text-blue-400"
                  onClick={() => handleSetApproved(blog.id)}
                >
                  Set approved
                </button>
              </div>
            )}
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
      <div className="flex items-center gap-5">
        <div className="my-3 border-gray-300 hover:border-blue-400 text-gray-300 hover:text-blue-400 transition-all border rounded-lg w-full max-w-[320px] pl-4 flex py-1">
          <input
            className="flex-1 text-sm text-gray-500 placeholder:text-sm "
            type="text"
            placeholder="Search"
            onChange={handleChangeSearch}
          />
          <div className="flex items-center mr-3 ">{icons.searchIcon}</div>
        </div>
        <Select
          defaultValue="All"
          style={{ width: "120px" }}
          onChange={handleChange}
          options={[
            { value: "", label: "All" },
            { value: "approved", label: "Approved" },
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
          title="Author"
          key="username"
          render={(blog) => (
            <div className="flex items-center gap-1">
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

        <Column
          title="Approved by"
          key="approvedBy"
          render={(blog) => {
            if (blog.approvedBy) {
              return (
                <div className="flex justify-center gap-2">
                  <p className="font-semibold text-gray-500">
                    {blog.approvedBy.username}
                  </p>
                  <Tag color="red">{blog?.approvedBy.role.name}</Tag>
                </div>
              );
            }
          }}
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

export default PostTable;
