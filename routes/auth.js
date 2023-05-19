const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../models/user");
const express = require("express");
const { Token } = require("../models/token");
const config = require("config");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  if (config.get("node_env") !== "development") {
    let isTokenExist = await Token.find({ user_id: user._id });
    if (isTokenExist && isTokenExist.length != 0)
      return res.status(400).send("User Already Logged in other device ");
  }

  const token = user.generateAuthToken();

  if (config.get("node_env") !== "development") {
    isTokenExist = new Token({
      user_id: user._id,
      device_id: req.body.device_id,
      token,
    });

    try {
      isTokenExist.save();
    } catch (err) {
      res.status(500).send("Internal Error");
    }
  }

  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    password: Joi.string().min(8).max(50).required(),
    device_id: Joi.string().max(50).required(),
  });
  return schema.validate(req);
}

module.exports = router;
