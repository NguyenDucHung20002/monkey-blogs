const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const { env } = require("./config/env");
const morgan = require("morgan");

const createRoles = require("./constant/role");

const app = express();
const cors = require("cors");
const authRouter = require("./routers/authRouter");
const topicRouter = require("./routers/topicRouter");
const profileRouter = require("./routers/profileRouter");
const followerShipRouter = require("./routers/followerShipRouter");

require("./services/googleOauth");

const { errorMiddleware } = require("./middlewares/errorMiddleware");

app.use(cors());

// express.json()
app.use(express.json());

app.use(morgan("dev"));

// passport
app.use(passport.initialize());

// Connet to database
mongoose
  .connect(env.MONGO_URL)
  .then(() => console.log("connect success"))
  .catch((err) => {
    console.log("Can not connect database");
    console.log(JSON.stringify(err, null, 2));
  });

// Create role
createRoles();

app.use("/api/auth", authRouter);
app.use("/api/topic", topicRouter);
app.use("/api/profile", profileRouter);
app.use("/api/follower-relationship", followerShipRouter);

app.use(errorMiddleware);

app.listen(env.SERVER_PORT || 8000, () => {
  console.log("Server is runing! port:" + env.SERVER_PORT);
});
