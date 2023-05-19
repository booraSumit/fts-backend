const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const admin = require("../middleware/admin");

router.post("/", admin, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.new_user.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User({
    ..._.pick(req.body.new_user, [
      "name",
      "email",
      "password",
      "department_id",
    ]),
    created_by: req.body?.user_id,
  });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  try {
    await user.save();
  } catch (err) {
    res.status(500).send("Internal Error");
  }

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
