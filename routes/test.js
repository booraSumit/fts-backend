const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.cookie("name", "amit", {
    // httpOnly: true,
    // domain: "http://localhost:3001/sign-in",
    sameSite: "strict",
    secure: false,
    httpOnly: true,
  });
  res.send("hello world");
});

module.exports = router;
