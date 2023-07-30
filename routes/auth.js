const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const express = require("express");
const config = require("config");
const router = express.Router();
const util = require("util");
const jwt = require("jsonwebtoken");

const { getDB } = require("../startup/db");

// const query = util.promisify(db.query).bind(db);

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let token;
  let department;
  try {
    const db = getDB();
    const [dept] = await db.query(
      "SELECT * FROM department d WHERE  d.user_name = ?",
      [req.body.userName]
    );
    if (!(dept.length > 0)) return res.send("invalid passoword or userName");
    const validPassword = await bcrypt.compare(
      req.body.password,
      dept[0].password
    );
    if (!validPassword)
      return res.status(400).send("Invalid userName or password.");

    //check for already logged in
    if (config.get("node_env") !== "development") {
      const [logged] = await db.query(
        "SELECT * FROM logged WHERE dept_id = ?",
        [dept[0].dept_id]
      );
      if (!(logged.length >= 1)) {
        const [result] = await db.query(
          "INSERT INTO logged (dept_id) VALUES(?)",
          [dept[0].dept_id]
        );
        if (!(result.affectedRows > 0))
          return res.send("Error occurred during authentication");
      } else return res.send("User Already Logged In");
    }
    department = dept[0];
    token = generateAuthToken(dept[0].dept_id);
  } catch (error) {
    console.error("Error occurred during authentication:", error.message);
    return res.status(500).send("Internal Error", error.message);
  }
  res
    .header("x-auth-token", token)
    .send(
      _.pick(department, [
        "dept_id",
        "name",
        "abr",
        "description",
        "profile_img",
        "user_name",
      ])
    );
});

const generateAuthToken = (user_id) => {
  const token = jwt.sign(user_id, config.get("jwtPrivateKey"));
  return token;
};

const validate = (req) => {
  const schema = Joi.object({
    userName: Joi.string().max(50).required(),
    password: Joi.string().min(4).max(50).required(),
  });
  return schema.validate(req);
};

module.exports = router;
