const Joi = require("joi");
const express = require("express");
const router = express.Router();
const { getDB } = require("../startup/db");

// const query = util.promisify(db.query).bind(db);

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const db = getDB();
    const [result] = await db.query(
      "SELECT dept_id FROM  logged WHERE dept_id = ?",
      [req.body.dept_id]
    );
    if (result.length > 0) {
      const [result] = await db.query("DELETE FROM  logged WHERE dept_id = ?", [
        req.body.dept_id,
      ]);
      if (result.affectedRows > 0) {
        return res.status(200).send("User logout successfull");
      }
    } else return res.status(400).send("Login first");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal error", err);
  }
});

function validate(req) {
  const schema = Joi.object({
    dept_id: Joi.number().greater(0).required(),
  });
  return schema.validate(req);
}

module.exports = router;
