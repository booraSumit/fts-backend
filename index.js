const express = require("express");
const app = express();
const { createServer } = require("http");
const httpserver = createServer(app);
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
    exposedHeaders: ["x-auth-token"],
  })
);
// require("./startup/socket").init(httpserver);
require("./startup/config")();
const { connectDB } = require("./startup/db");
connectDB();
require("./startup/routes")(app);
const port = process.env.PORT || 3000;
const server = httpserver.listen(port, () =>
  console.log(`listening on port ${port}...`)
);

module.exports = server;
