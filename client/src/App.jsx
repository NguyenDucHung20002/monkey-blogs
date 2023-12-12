import React, { Suspense } from "react";
import { Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import StaffPickPage from "./pages/StaffPickPage";
import MeMuted from "./pages/MeMuted";
import PostResolved from "./modules/post/PostResolved";
const PostReportManage = React.lazy(() =>
  import("./modules/post/PostReportAManage")
);
import MeLayout from "./layout/MeLayout";
import MeStoryPage from "./pages/MeStoryPage";
import MeLibraryPage from "./pages/MeLibraryPage";
import MyDraft from "./modules/story/MyDraft";
import ReadingHistory from "./modules/library/ReadingHistory";
const ProfileFollowing = React.lazy(() =>
  import("./modules/profile/ProfileFollowing")
);
const ProfileFollower = React.lazy(() =>
  import("./modules/profile/ProfileFollower")
);
const ProfileHome = React.lazy(() => import("./modules/profile/ProfileHome"));
const ProfileReadingList = React.lazy(() =>
  import("./modules/profile/ProfileReadingList")
);
const UserReportsResolved = React.lazy(() =>
  import("./modules/user/UserReportsResolved")
);
const UserReportManage = React.lazy(() =>
  import("./modules/user/UserReportManage")
);
const MeFollowingPage = React.lazy(() => import("./pages/MeFollowingPage"));
const MeSuggestionPage = React.lazy(() => import("./pages/MeSuggestionPage"));
const SearchPage = React.lazy(() => import("./pages/SearchPage"));
const SearchStoriesPage = React.lazy(() => import("./pages/SearchStoriesPage"));
const SearchTopicsPage = React.lazy(() => import("./pages/SearchTopicsPage"));
const SearchUsersPage = React.lazy(() => import("./pages/SearchUsersPage"));
const EditBlogPage = React.lazy(() => import("./pages/EditBlogPage"));
const MePage = React.lazy(() => import("./pages/MePage"));
const FollowingPage = React.lazy(() => import("./pages/FollowingPage"));
const HomeMain = React.lazy(() => import("./modules/home/HomeMain"));
const TopicPage = React.lazy(() => import("./pages/TopicPage"));
const TopicUpdate = React.lazy(() => import("./modules/topic/TopicUpdate"));
const TopicAddNew = React.lazy(() => import("./modules/topic/TopicAddNew"));
const PostDetailPage = React.lazy(() => import("./pages/PostDetailPage"));
const UserManage = React.lazy(() => import("./modules/user/UserManage"));
const PostManage = React.lazy(() => import("./modules/post/PostManage"));
const TopicManage = React.lazy(() => import("./modules/topic/TopicManage"));
const WritePage = React.lazy(() => import("./pages/WritePage"));
const DashboardLayout = React.lazy(() =>
  import("./modules/dashboard/DashboardLayouts")
);

const DashboardPage = React.lazy(() => import("./pages/DashboardPage"));
const ProfilePage = React.lazy(() => import("./pages/ProfilePage"));
const Layout = React.lazy(() => import("./layout/Layout"));
const PageNotFound = React.lazy(() => import("./pages/PageNotFound"));
const StartedTopicsPage = React.lazy(() => import("./pages/StartedTopicsPage"));
const HomePage = React.lazy(() => import("./pages/HomePage"));
const SignInPage = React.lazy(() => import("./pages/SignInPage"));

function App() {
  return (
    <div id="main">
      <Suspense>
        <Routes>
          <Route element={<Layout></Layout>}>
            <Route element={<HomePage></HomePage>}>
              <Route path="/" element={<HomeMain></HomeMain>}></Route>
              <Route
                path="/following"
                element={<FollowingPage></FollowingPage>}
              ></Route>
            </Route>
            <Route element={<MePage></MePage>}>
              <Route
                path="/me/following"
                element={<MeFollowingPage></MeFollowingPage>}
              ></Route>
              <Route path="/me/muted" element={<MeMuted></MeMuted>}></Route>
              <Route
                path="/me/suggestions"
                element={<MeSuggestionPage></MeSuggestionPage>}
              ></Route>
            </Route>
            <Route element={<MeLayout />}>
              <Route element={<MeStoryPage />}>
                <Route
                  path="/me/stories/drafts"
                  element={<MyDraft></MyDraft>}
                />
              </Route>
              <Route element={<MeLibraryPage />}>
                <Route
                  path="/me/library/reading-history"
                  element={<ReadingHistory />}
                />
              </Route>
            </Route>
            <Route
              path="/blog/:slug"
              element={<PostDetailPage></PostDetailPage>}
            ></Route>
            <Route
              path="/topic/:slug"
              element={<TopicPage></TopicPage>}
            ></Route>
            <Route element={<ProfilePage></ProfilePage>}>
              <Route path="/profile/:username" element={<ProfileHome />} />
              <Route
                path="/profile/follower/:username"
                element={<ProfileFollower />}
              />
              <Route
                path="/profile/staff-pick/:username"
                element={<StaffPickPage />}
              />
              <Route
                path="/profile/following/:username"
                element={<ProfileFollowing />}
              />
              <Route
                path="/profile/reading-list/:username"
                element={<ProfileReadingList></ProfileReadingList>}
              />
            </Route>

            <Route element={<SearchPage></SearchPage>}>
              <Route
                path="/search"
                element={<SearchStoriesPage></SearchStoriesPage>}
              ></Route>
              <Route
                path="/search/topics"
                element={<SearchTopicsPage></SearchTopicsPage>}
              ></Route>
              <Route
                path="/search/people"
                element={<SearchUsersPage></SearchUsersPage>}
              ></Route>
            </Route>
          </Route>
          <Route element={<DashboardLayout></DashboardLayout>}>
            <Route
              path="/dashboard"
              element={<DashboardPage></DashboardPage>}
            ></Route>
            <Route
              path="/manage/topic"
              element={<TopicManage></TopicManage>}
            ></Route>
            <Route
              path="/manage/add-topic"
              element={<TopicAddNew></TopicAddNew>}
            ></Route>
            <Route
              path="/manage/update-topic"
              element={<TopicUpdate></TopicUpdate>}
            ></Route>
            <Route
              path="/manage/posts"
              element={<PostManage></PostManage>}
            ></Route>
            <Route
              path="/manage/report-article"
              element={<PostReportManage></PostReportManage>}
            ></Route>
            <Route
              path="/manage/report-article-resolved"
              element={<PostResolved></PostResolved>}
            ></Route>
            <Route
              path="/manage/user"
              element={<UserManage></UserManage>}
            ></Route>
            <Route
              path="/manage/report-user"
              element={<UserReportManage></UserReportManage>}
            ></Route>
            <Route
              path="/manage/report-user-resolved"
              element={<UserReportsResolved></UserReportsResolved>}
            ></Route>
          </Route>
          <Route path="/sign-in" element={<SignInPage></SignInPage>}></Route>
          <Route
            path="/get-started/topics"
            element={<StartedTopicsPage></StartedTopicsPage>}
          ></Route>
          <Route path="/write" element={<WritePage></WritePage>}></Route>
          <Route
            path="/edit-blog/:slug"
            element={<EditBlogPage></EditBlogPage>}
          ></Route>
          <Route path="*" element={<PageNotFound></PageNotFound>}></Route>
        </Routes>
      </Suspense>
      <ToastContainer></ToastContainer>
    </div>
  );
}

export default App;
