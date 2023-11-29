import UserTable from "./UserTable.jsx";
import DashboardHeading from "../dashboard/DashboardHeading";

const UserManage = () => {
  // const { userInfo } = useAuth();
  // if (userInfo.role !== userRole.ADMIN) return null;
  return (
    <div>
      <DashboardHeading title="Users"></DashboardHeading>
      <UserTable></UserTable>
    </div>
  );
};

export default UserManage;
