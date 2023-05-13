const config = require("config");
const express = require("express");
const app = express();

require("./startup/config")();
require("./startup/db")();
require("./startup/routes")(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  console.log(`listing on port ${port}...`)
);

module.exports = server;
