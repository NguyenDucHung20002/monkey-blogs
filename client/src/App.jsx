import React, { Suspense } from "react";
import { Route, Routes } from "react-router";
import { AuthProvider } from "./contexts/auth-context";
import { ToastContainer } from "react-toastify";
import MeFollowingPage from "./pages/MeFollowingPage";
import MeSuggestionPage from "./pages/MeSuggestionPage";
import SearchPage from "./pages/SearchPage";
import SearchStoriesPage from "./pages/SearchStoriesPage";
import SearchTopicsPage from "./pages/SearchTopicsPage";
import SearchUsersPage from "./pages/SearchUsersPage";
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
    <div>
      <AuthProvider>
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
                <Route
                  path="/me/suggestions"
                  element={<MeSuggestionPage></MeSuggestionPage>}
                ></Route>
              </Route>
              <Route
                path="/blog/:slug"
                element={<PostDetailPage></PostDetailPage>}
              ></Route>
              <Route
                path="/topic/:slug"
                element={<TopicPage></TopicPage>}
              ></Route>
              <Route
                path="/profile/:username"
                element={<ProfilePage></ProfilePage>}
              ></Route>

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
                path="/manage/update-topic/:slug"
                element={<TopicUpdate></TopicUpdate>}
              ></Route>
              <Route
                path="/manage/posts"
                element={<PostManage></PostManage>}
              ></Route>
              <Route
                path="/manage/user"
                element={<UserManage></UserManage>}
              ></Route>
            </Route>
            <Route path="/sign-in" element={<SignInPage></SignInPage>}></Route>
            <Route
              path="/get-started/topics"
              element={<StartedTopicsPage></StartedTopicsPage>}
            ></Route>
            <Route path="/write" element={<WritePage></WritePage>}></Route>
            <Route path="*" element={<PageNotFound></PageNotFound>}></Route>
          </Routes>
        </Suspense>
        <ToastContainer></ToastContainer>
      </AuthProvider>
    </div>
  );
}

export default App;
