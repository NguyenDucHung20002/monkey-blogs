import express from "express";
import env from "./config/env.js";
import morgan from "morgan";
import cors from "cors";
import MongoDB from "./databases/mongodb/connect.js";
import sequelize from "./databases/mysql/connect.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import socket from "./socket.js";
import http from "http";

const app = express();

import checkToUnRestrictUsers from "./scripts/checkToUnRestrictUsers.js";
import deleteSocketUsers from "./scripts/deleteSocketUser.js";
import "./models/mysql/Association.js";
import "./services/passport.js";
import "./cron.js";

import authRoute from "./routes/authRoute.js";
import muteRoute from "./routes/muteRoute.js";
import blockRoute from "./routes/blockRoute.js";
import userRoute from "./routes/userRoute.js";
import reportUserRoute from "./routes/reportUserRoute.js";
import profileRoute from "./routes/profileRoute.js";
import followProfileRoute from "./routes/followProfileRoute.js";
import topicRoute from "./routes/topicRoute.js";
import followTopicRoute from "./routes/followTopicRoute.js";
import articleRoute from "./routes/articleRoute.js";
import likeRoute from "./routes/likeRoute.js";
import roleRoute from "./routes/roleRoute.js";
import reportArticleRoute from "./routes/reportArticleRoute.js";
import commentRoute from "./routes/commentRoute.js";
import readingHistoryRoute from "./routes/readingHistoryRoute.js";
import searchRoute from "./routes/searchRoute.js";
import fileRoute from "./routes/fileRoute.js";
import readingListRoute from "./routes/readingListRoute.js";
import notificationRoute from "./routes/notificationRouter.js";

app.use(express.json());
app.use(morgan("dev"));
app.use(cors("*"));

MongoDB.connect();

sequelize
  .authenticate()
  .then(() => {
    console.log("connect to mysql database successfully");
  })
  .then(() => {
    deleteSocketUsers();
    checkToUnRestrictUsers();
  })
  .catch((error) => {
    console.log("can not connect to mysql database");
    console.log("ERROR =>", error);
  });

app.use(`/api/v1/auth`, authRoute);
app.use(`/api/v1/mute`, muteRoute);
app.use(`/api/v1/block`, blockRoute);
app.use(`/api/v1/user`, userRoute);
app.use(`/api/v1/report-user`, reportUserRoute);
app.use(`/api/v1/profile`, profileRoute);
app.use(`/api/v1/follow-profile`, followProfileRoute);
app.use(`/api/v1/topic`, topicRoute);
app.use(`/api/v1/follow-topic`, followTopicRoute);
app.use(`/api/v1/article`, articleRoute);
app.use(`/api/v1/like`, likeRoute);
app.use(`/api/v1/role`, roleRoute);
app.use(`/api/v1/report-article`, reportArticleRoute);
app.use(`/api/v1/comment`, commentRoute);
app.use(`/api/v1/reading-history`, readingHistoryRoute);
app.use(`/api/v1/search`, searchRoute);
app.use(`/api/v1/file`, fileRoute);
app.use(`/api/v1/reading-list`, readingListRoute);
app.use(`/api/v1/notification`, notificationRoute);

app.use(errorMiddleware);

const httpServer = http.createServer(app);

socket.initializeSocket(httpServer);

httpServer.listen(env.SERVER_PORT, () => {
  console.log(`server is running on port: ${env.SERVER_PORT}`);
});
