import React, { Suspense } from "react";
import { Route, Routes } from "react-router";
import { AuthProvider } from "./contexts/auth-context";

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
              <Route path="/" element={<HomePage></HomePage>}></Route>
              <Route path="/profile" element={<ProfilePage></ProfilePage>}></Route>
            </Route>
            <Route path="/sign-in" element={<SignInPage></SignInPage>}></Route>
            <Route
              path="/get-started/topics"
              element={<StartedTopicsPage></StartedTopicsPage>}
            ></Route>
            <Route
              path="/write"
              element={<StartedTopicsPage></StartedTopicsPage>}
            ></Route>
            <Route path="*" element={<PageNotFound></PageNotFound>}></Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </div>
  );
}

export default App;