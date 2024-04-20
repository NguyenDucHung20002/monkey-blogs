import { useEffect, useState, useRef } from "react";
import { useAuth } from "../contexts/auth-context";
import { Link } from "react-router-dom";
import Avatar from "../modules/user/Avatar";
import { apiGetBlockedProfiles } from "../api/apiNew";
import ButtonBlocked from "../components/button/ButtonBlocked";
import { debounce } from "lodash";

const MeBlocked = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  const { userInfo } = useAuth();
  const skip = useRef("");
  const windowHeight = useRef(window.innerHeight);
  const scrollY = useRef(window.scrollY);
  const documentHeight = useRef(document.documentElement.scrollHeight);

  useEffect(() => {
    async function fetchUser() {
      const response = await apiGetBlockedProfiles(token, 15);
      if (response) {
        setUsers([...response.data]);
        skip.current = response.newSkip;
      }
    }
    fetchUser();
  }, [token]);

  useEffect(() => {
    const handleScroll = async () => {
      windowHeight.current = window.innerHeight;
      scrollY.current = window.scrollY;
      documentHeight.current = document.documentElement.scrollHeight;
      if (
        windowHeight.current + scrollY.current + 10 >= documentHeight.current &&
        skip.current
      ) {
        const response = await apiGetBlockedProfiles(token, 15, skip.current);
        if (response) {
          const usersClone = [...users, ...response.data];
          setUsers([...usersClone]);
          skip.current = response.newSkip;
        }
      }
    };
    const debouncedScroll = debounce(handleScroll, 200);

    window.addEventListener("scroll", debouncedScroll);

    return () => {
      window.removeEventListener("scroll", debouncedScroll);
    };
  }, [users]);

  if (!userInfo) return;

  return (
    <div>
      <div className="user-following max-w-[700px] w-full mx-auto">
        <div className="pb-4 mt-6 ">
          <h3 className="mb-3 text-base font-bold">Blocked authors</h3>
          {users &&
            users.length > 0 &&
            users.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center ">
                  <Link to={`/profile/${user.userInfo.username}`}>
                    <Avatar
                      className="cursor-pointer"
                      size="small"
                      url={user.avatar}
                    />
                  </Link>
                  <div className="py-3 pr-5 ml-2 ">
                    <Link to={`/profile/${user.userInfo.username}`}>
                      <h3 className="text-base font-semibold text-gray-400 transition-all hover:text-gray-600">
                        {user.fullname}
                      </h3>
                    </Link>
                    {user.bio && (
                      <p className="max-w-xs text-sm line-clamp-2">
                        {user.bio}
                      </p>
                    )}
                  </div>
                </div>
                <ButtonBlocked
                  userId={user.id}
                  initialBlock={true}
                ></ButtonBlocked>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MeBlocked;
