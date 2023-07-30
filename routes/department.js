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

router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const [departments] = await db.query("SELECT name,dept_id FROM department");
    res.send(departments);
  } catch (error) {
    res.status(500).send("internal error during fetching department");
  }
});

module.exports = router;
