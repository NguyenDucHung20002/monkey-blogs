import React, { Suspense } from "react";
import { Route, Routes } from "react-router";
import { AuthProvider } from "./contexts/auth-context";
import { ToastContainer } from "react-toastify";

const WritePage = React.lazy(() => import("./pages/WritePage"));
const Profile = React.lazy(() => import("./pages/Profile"));
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
              <Route path="/" element={<HomePage></HomePage>}></Route>
              <Route path="/profile" element={<Profile></Profile>}></Route>
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
