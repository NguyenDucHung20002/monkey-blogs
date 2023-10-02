import React, { Suspense } from "react";
import { Route, Routes } from "react-router";
import { AuthProvider } from "./contexts/auth-context";
import PageNotFound from "./pages/PageNotFound";
import StartedTopicsPage from "./pages/StartedTopicsPage";

const HomePage = React.lazy(() => import("./pages/HomePage"));
const SignInPage = React.lazy(() => import("./pages/SignInPage"));

function App() {
  return (
    <div>
      <AuthProvider>
        <Suspense>
          <Routes>
            <Route path="/" element={<HomePage></HomePage>}></Route>
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
