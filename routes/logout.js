const Joi = require("joi");
const _ = require("lodash");
const express = require("express");
const { Token } = require("../models/token");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    let isTokenExist = await Token.findOneAndDelete({
      user_id: req.body.user_id,
    });

    if (!isTokenExist) return res.status(400).send("Login first");

    res.status(200).send("User logout successfull");
  } catch (err) {
    console.log(err);
    res.send(500).send("Internal error");
  }
});

function validate(req) {
  const schema = Joi.object({
    user_id: Joi.string().hex().length(24),
  });
  return schema.validate(req);
}

module.exports = router;
