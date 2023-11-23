import ActionDelete from "../../action/ActionDelete";
import ActionEdit from "../../action/ActionEdit";
import ActionView from "../../action/ActionView";
import { LabelStatus } from "../../components/label";
import img from "../../assets/logo.png";
import { Table } from "../../components/table";
import DashboardHeading from "../dashboard/DashboardHeading";

const PostManage = () => {
  return (
    <div>
      <DashboardHeading
        title="All posts"
        desc="Manage all posts"
      ></DashboardHeading>

      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Post</th>
            <th>Category</th>
            <th>Author</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Test</td>
            <td className="!pr-[100px]">
              <div className="flex items-center gap-x-3">
                <img
                  src={img}
                  alt=""
                  className="w-[66px] h-[55px] rounded object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">Test</h3>
                  <time className="text-sm text-gray-500">
                    Date: 21/11/2002
                  </time>
                </div>
              </div>
            </td>
            <td>
              <span className="text-gray-500">Test</span>
            </td>
            <td>
              <span className="text-gray-500">Hungpro</span>
            </td>
            <td>
              <LabelStatus type="success">Approved</LabelStatus>
            </td>
            <td>
              <div className="flex items-center text-gray-500 gap-x-3">
                <ActionView onClick={() => {}}></ActionView>
                <ActionEdit onClick={() => {}}></ActionEdit>
                <ActionDelete onClick={() => {}}></ActionDelete>
              </div>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default PostManage;
