const config = require("config");
const express = require("express");
const app = express();
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
    exposedHeaders: ["x-auth-token"],
  })
);

require("./startup/config")();
require("./startup/db")();
require("./startup/routes")(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  console.log(`listening on port ${port}...`)
);

module.exports = server;
