import DashboardHeading from "../dashboard/DashboardHeading";
import UserReportTable from "./UserReportTable";

const UserReportManage = () => {
  return (
    <div>
      <DashboardHeading title="Report Users"></DashboardHeading>
      <UserReportTable></UserReportTable>
    </div>
  );
};

export default UserReportManage;
