const express = require("express");
const user = require("../routes/users");
const admin = require("../routes/admins");
const auth = require("../routes/auth");
const logout = require("../routes/logout");
const test = require("../routes/test");
const jsonParseErrHandler = require("../middleware/jsonParseErrHandler");
const cookieParser = require("cookie-parser");

module.exports = function (app) {
  app.use(express.json());
  app.use(jsonParseErrHandler);
  app.use(cookieParser());
  app.use("/api/new-user", user);
  app.use("/api/new-admin", admin);
  app.use("/api/auth", auth);
  app.use("/api/logout", logout);
  app.use("/api/test", test);
};
