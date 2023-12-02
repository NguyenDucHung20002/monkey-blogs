/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import DashboardHeading from "../dashboard/DashboardHeading";
import { apiGetUsersResolved } from "../../api/apisHung";
import { Popover, Table, Tag } from "antd";
import Column from "antd/es/table/Column";
import { NavLink } from "react-router-dom";

const UserReportsResolved = () => {
  const token = localStorage.getItem("token");
  const [reports, setReports] = useState([]);
  const skip = useRef("");
  useEffect(() => {
    async function fetchUserResolved() {
      const response = await apiGetUsersResolved(token);
      console.log("response:", response);
      if (response?.success) {
        const mapReports = response.data.map((report) => {
          return {
            ...report,
            key: report.id,
          };
        });
        setReports(mapReports);
        skip.current = response.newSkip;
      }
    }

    fetchUserResolved();
  }, [token]);

  // const handleLoadMore = async () => {
  //   const newSkip = skip.current;
  //   const response = await apiGetUsersResolved(token, 1, newSkip);
  //   if (response) {
  //     console.log("response:", response);
  //     const mapReports = response.data.map((report) => {
  //       return {
  //         ...report,
  //         key: report.id,
  //       };
  //     });
  //     setReports([...reports, ...mapReports]);
  //     skip.current = response.newSkipId;
  //   }
  // };

  const ButtonBaned = ({ resolvedBy, reason, description }) => (
    <div>
      <Popover
        content={
          <div>
            <p>
              <span>Resolved by</span> {resolvedBy.username} (
              {resolvedBy.role.name})
            </p>
            <p>
              <span>Reason: </span> {reason}
            </p>
            {description && (
              <p className="max-w-[500px]">
                <span>Description: </span> {description}
              </p>
            )}
          </div>
        }
        placement="bottom"
      >
        <Tag className="cursor-pointer" color="green">
          RESOLVED
        </Tag>
      </Popover>
    </div>
  );

  return (
    <div>
      <DashboardHeading title="Report Users Resolved"></DashboardHeading>
      <Table dataSource={reports} pagination={false}>
        <Column title="Id" key="id" dataIndex="id" />
        <Column
          title="Accused"
          key="accused"
          render={(report) => (
            <NavLink to={`profile/${report.reported.username}`}>
              <p className="font-medium whitespace-nowrap">
                {report.reported.username}
              </p>
            </NavLink>
          )}
        />
        <Column
          title="Accuser"
          key="accuser"
          render={(report) => (
            <NavLink to={`profile/${report.reporter.username}`}>
              <p className="font-medium whitespace-nowrap">
                {report.reporter.username}
              </p>
            </NavLink>
          )}
        />
        <Column
          title="Status"
          key="status"
          render={(report) => (
            <ButtonBaned
              resolvedBy={report.resolvedBy}
              reason={report.reason}
              description={report.description}
            ></ButtonBaned>
          )}
        />
      </Table>

      {/* {reports && reports.length > 0 && (
        <div className="flex justify-center mt-5" onClick={handleLoadMore}>
          <Button type="button" kind="primary" height="40px">
            Load more
          </Button>
        </div>
      )} */}
    </div>
  );
};

export default UserReportsResolved;
