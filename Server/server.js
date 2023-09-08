const express = require("express");
const { env } = require("./config/env");

const app = express();
const cors = require("cors");

app.use(cors());

app.listen(env.PORT || 8000, () => {
  console.log("Server is runing! port:" + env.PORT);
});
