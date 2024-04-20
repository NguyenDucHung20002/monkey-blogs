import { useContext, useEffect, useState, useRef } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { apiGetReadingList } from "../../api/apisHung";
import styled from "styled-components";
import Blog from "../blog/Blog";
import { NavbarHome } from "../../components/navbar";
import { DesignContext } from "../../pages/DesignPage";
import { debounce } from "lodash";

const ReadingListStyle = styled.div`
  max-width: 700px;
  width: 100%;
  margin: 0 auto 50px;
  overflow-y: auto;
  flex: 1;
  height: 100%;
`;

const ProfileReadingList = () => {
  const [blogs, setBlogs] = useState([]);
  const data = useOutletContext();
  const token = localStorage.getItem("token");
  const user = data?.user;
  const { username } = useParams();
  const { showFollowRecommend } = useContext(DesignContext);
  const skip = useRef("");
  const windowHeight = useRef(window.innerHeight);
  const scrollY = useRef(window.scrollY);
  const documentHeight = useRef(document.documentElement.scrollHeight);

  const navProfile = [
    {
      title: "Home",
      url: `/profile/${username}`,
    },
    {
      title: "Follower",
      url: `/profile/follower/${username}`,
    },
    {
      title: "Following",
      url: `/profile/following/${username}`,
    },
  ];

  const navMyProfile = [
    {
      title: "Home",
      url: `/profile/${username}`,
    },
    {
      title: "Follower",
      url: `/profile/follower/${username}`,
    },
    {
      title: "Following",
      url: `/profile/following/${username}`,
    },
    {
      title: "Reading List",
      url: `/profile/reading-list/${username}`,
    },
  ];
  if (!showFollowRecommend?.about) {
    navProfile.push({
      title: "About",
      url: `/profile/about/${username}`,
    });
    navMyProfile.push({
      title: "About",
      url: `/profile/about/${username}`,
    });
  }

  useEffect(() => {
    async function fetchUserBlog() {
      const response = await apiGetReadingList(token, 15);
      if (response) {
        setBlogs(response.data);
        skip.current = response.newSkip;
      }
    }
    fetchUserBlog();
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
        const response = await apiGetReadingList(token, 15, skip.current);
        if (response) {
          const blogsClone = [...blogs, ...response.data];
          setBlogs([...blogsClone]);
          skip.current = response.newSkip;
        }
      }
    };
    const debouncedScroll = debounce(handleScroll, 200);

    window.addEventListener("scroll", debouncedScroll);

    return () => {
      window.removeEventListener("scroll", debouncedScroll);
    };
  }, [blogs]);

  if (!user?.isMyProfile) return null;

  return (
    <>
      <NavbarHome
        data={user?.isMyProfile ? navMyProfile : navProfile}
        className="flex-1"
      />
      <ReadingListStyle>
        <div>
          {blogs &&
            blogs.length > 0 &&
            blogs.map((blog) => (
              <Blog key={blog.id} isMyProfile={true} blog={blog}></Blog>
            ))}
        </div>
      </ReadingListStyle>
    </>
  );
};

export default ProfileReadingList;
