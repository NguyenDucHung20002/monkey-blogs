import { Table } from "../../components/table";

const UserTable = () => {
  // const renderUserItem = (user) => {
  //   return (
  //     <tr key={user.id}>
  //       <td title={user.id}>{user.id.slice(0, 5) + "..."}</td>
  //       <td className="whitespace-nowrap">
  //         <div className="flex items-center gap-x-3">
  //           <img
  //             src={user?.avatar}
  //             alt=""
  //             className="flex-shrink-0 object-cover w-10 h-10 rounded-md"
  //           />
  //           <div className="flex-1">
  //             <h3>{user?.fullname}</h3>
  //             <time className="text-sm text-gray-300">
  //               {new Date(user?.createdAt?.seconds * 1000).toLocaleDateString(
  //                 "vi-VI"
  //               )}
  //             </time>
  //           </div>
  //         </div>
  //       </td>
  //       <td>{user?.username}</td>
  //       <td>{user?.email.slice(0, 5) + "..."}</td>
  //       <td>{renderLabelStatus(Number(user?.status))}</td>
  //       <td>{renderRoleLabel(Number(user.role))}</td>
  //       <td>
  //         <div className="flex items-center text-gray-500 gap-x-3">
  //           <ActionEdit
  //             onClick={() => navigate(`/manage/update-user?id=${user.id}`)}
  //           ></ActionEdit>
  //           <ActionDelete onClick={() => handleDeleteUser(user)}></ActionDelete>
  //         </div>
  //       </td>
  //     </tr>
  //   );
  // };
  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Info</th>
            <th>Username</th>
            <th>Email address</th>
            <th>Status</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody></tbody>
      </Table>
    </div>
  );
};

export default UserTable;
