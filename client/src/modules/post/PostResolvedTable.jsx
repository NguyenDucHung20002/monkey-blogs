/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { apiGetReportsBlogSolved } from "../../api/apisHung";
import { Table, Tag } from "antd";
import Column from "antd/es/table/Column";
import useTimeAgo from "../../hooks/useTimeAgo";
// import { Button } from "../../components/button";

const PostResolvedTable = () => {
  const getTimeAgo = useTimeAgo;
  const [blogReports, setBlogReports] = useState([]);
  console.log("blogReports:", blogReports);
  const token = localStorage.getItem("token");
  const skip = useRef(0);
  // const [searchBlogs, setSearchBlogs] = useState("");
  // const [status, setStatus] = useState("");

  // const handleChangeSearch = debounce((e) => {
  //   setSearchBlogs(e.target.value);
  // }, 200);

  useEffect(() => {
    async function fetchReports() {
      const response = await apiGetReportsBlogSolved(token);
      if (response.success) {
        skip.current = response.newSkip;
        const mapBlogs = response.data.map((blog) => {
          return {
            ...blog,
            key: blog.id,
          };
        });
        setBlogReports(mapBlogs);
      }
    }
    fetchReports();
  }, [token]);

  // const handleLoadMore = async () => {
  //   const newSkip = skip.current;
  //   const response = await apiGetAllArticlesAdmin(
  //     token,
  //     10,
  //     searchBlogs,
  //     status,
  //     newSkip
  //   );
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

  // const ShowAuthor = ({ author }) => {
  //   return (
  //     <Popover
  //       content={
  //         <div>
  //           <Link
  //             className="flex items-center gap-2"
  //             to={`/profile/${author?.userInfo?.username}`}
  //           >
  //             <p>
  //               {author?.userInfo?.username} . {author?.userInfo?.role?.slug}
  //             </p>
  //           </Link>
  //         </div>
  //       }
  //       placement="bottom"
  //     >
  //       <p className="flex items-end gap-1 font-semibold text-gray-400 hover:text-gray-600">
  //         {author.fullname}
  //       </p>
  //     </Popover>
  //   );
  // };

  // const handleChange = (value) => {
  //   setStatus(value);
  // };

  return (
    <>
      {/* <div className="flex items-center gap-5">
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
      </div> */}
      <Table
        dataSource={blogReports}
        pagination={false}
        className="overflow-y-auto"
      >
        <Column
          title="User name"
          key="username"
          render={(blog) => (
            <>
              <p className="font-semibold text-gray-500">
                {blog?.article?.author?.userInfo?.username}
              </p>
            </>
          )}
        />
        <Column
          title="Full name"
          key="fullname"
          render={(blog) => (
            <>
              <p className="flex-wrap font-semibold text-gray-500 whitespace-nowrap">
                {blog?.article?.author?.fullname}
              </p>
            </>
          )}
        />
        <Column
          title="Role"
          key="role"
          render={(blog) => (
            <>
              {blog?.article?.author?.userInfo?.role.slug === "user" ? (
                <Tag color="green">
                  {blog?.article?.author?.userInfo?.role.name}
                </Tag>
              ) : (
                <Tag color="red">
                  {blog?.article?.author?.userInfo?.role.name}
                </Tag>
              )}
            </>
          )}
        />
        <Column
          title="Slug"
          key="slug"
          render={(blog) => (
            <p className="w-40 font-medium">{blog?.article.slug}</p>
          )}
        />
        <Column
          title="Title"
          key="title"
          render={(blog) => (
            <p className="w-40 font-medium">{blog?.article.title}</p>
          )}
        />
        <Column
          title="Status"
          key="status"
          render={(blog) => <Tag color="green">{blog?.status}</Tag>}
        />
        <Column
          title="Resolved by"
          key="resolvedBy"
          render={(blog) => (
            <div className="flex justify-center gap-2">
              <p className="font-semibold text-gray-500">
                {blog.resolvedBy.username}
              </p>
              <Tag color="red">{blog?.resolvedBy.role.name}</Tag>
            </div>
          )}
        />
        <Column
          title="Resolved at"
          key="resolvedAt"
          render={(blog) => (
            <p className="font-semibold text-gray-500 whitespace-nowrap">
              {getTimeAgo(blog.updatedAt)}
            </p>
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

export default PostResolvedTable;
