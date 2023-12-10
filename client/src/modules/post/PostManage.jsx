import DashboardHeading from "../dashboard/DashboardHeading";
import PostTable from "./PostTable";

const PostManage = () => {
  return (
    <div>
      <DashboardHeading
        title="All posts"
        desc="Manage all posts"
      ></DashboardHeading>
      <PostTable></PostTable>
    </div>
  );
};

export default PostManage;
