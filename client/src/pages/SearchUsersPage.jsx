import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { config } from "../utils/constants";
import FollowingUserHandle from "../components/following/FollowingUserHandle";
import axios from "axios";

const SearchUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("q");
  useEffect(() => {
    async function fetchTopics() {
      try {
        const response = await axios.post(
          `${config.SERVER_HOST}:${config.SERVER_PORT}/api/user/search`,
          {
            search,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response?.data) setUsers(response.data?.data);
      } catch (error) {
        console.log("error:", error);
      }
    }
    fetchTopics();
  }, [search]);

  return (
    <div className="user-following max-w-[700px] w-full mx-auto mt-5">
      {users &&
        users.length > 0 &&
        users.map((user) => (
          <FollowingUserHandle key={user._id} data={user}></FollowingUserHandle>
        ))}
    </div>
  );
};

export default SearchUsersPage;
