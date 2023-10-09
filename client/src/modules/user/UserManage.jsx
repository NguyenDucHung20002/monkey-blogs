import UserTable from "./UserTable.jsx";
import DashboardHeading from "../dashboard/DashboardHeading";
import Button from "../../components/button/Button.jsx";

const UserManage = () => {
  // const { userInfo } = useAuth();
  // if (userInfo.role !== userRole.ADMIN) return null;
  return (
    <div>
      <DashboardHeading title="Users" desc="Manage your user">
        <Button kind="primary" height="50px" to="/manage/add-user">
          Create user
        </Button>
      </DashboardHeading>

      <UserTable></UserTable>
    </div>
  );
};

export default UserManage;
