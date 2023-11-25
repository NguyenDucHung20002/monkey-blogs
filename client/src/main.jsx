import React from "react";
import "./styles/index.scss";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "./styles/GlobalStyle";
import { BrowserRouter } from "react-router-dom";
import { theme } from "./utils/constants";
import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { AuthProvider } from "./contexts/auth-context.jsx";
import { SocketProvider } from "./contexts/SocketContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <React.StrictMode>
      <GlobalStyles></GlobalStyles>
      <BrowserRouter>
        <AuthProvider>
          <SocketProvider>
            <App />
          </SocketProvider>
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  </ThemeProvider>
);
