// eslint-disable-next-line no-unused-vars
import React from "react";
import DashboardHeading from "../dashboard/DashboardHeading";
import TopicTable from "./TopicTable";

const TopicManage = () => {
  return (
    <div>
      <DashboardHeading title="Topics"></DashboardHeading>
      <TopicTable></TopicTable>
    </div>
  );
};

export default TopicManage;
