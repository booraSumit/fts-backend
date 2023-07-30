const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const express = require("express");
const config = require("config");
const router = express.Router();
const util = require("util");
const jwt = require("jsonwebtoken");

const { getDB } = require("../startup/db");
const getDocumentDetail = require("../procedures/getDocumentDetail");

// const query = util.promisify(db.query).bind(db);

router.post("/newDocument", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { doc_no, subject, content, description, origin, recipient } = req.body;
  const db = getDB();
  let docId = undefined;
  try {
    await db.beginTransaction();
    const [dateTimeResult] = await db.query(`select now() as dateTime`);
    const [docInsertResult] = await db.query(
      `INSERT INTO document ( doc_no, subject,description,content,date_time)
     VALUES ( ?,?,?,?,?);`,
      [doc_no, subject, description, content, dateTimeResult[0].dateTime]
    );

    const [lastInserIdResult] = await db.query(
      `select LAST_INSERT_ID() AS lastInsertId`
    );

    docId = lastInserIdResult[0].lastInsertId;

    const [transactionResult] = await db.query(
      `INSERT INTO transaction (origin, recipient, doc_id, date_time)
     VALUES (?,? ,? ,? );`,
      [
        origin,
        recipient,
        lastInserIdResult[0].lastInsertId,
        dateTimeResult[0].dateTime,
      ]
    );

    const [readOnlyResult] = await db.query(
      `INSERT INTO document_readonly(dept_id,doc_id) VALUES(?, ?),(?,?);`,
      [
        origin,
        lastInserIdResult[0].lastInsertId,
        recipient,
        lastInserIdResult[0].lastInsertId,
      ]
    );
    const [result] = await db.query("select * from document where doc_id = ?", [
      lastInserIdResult[0].lastInsertId,
    ]);
    console.log(result);
    const doucment = getDocumentDetail(docId, origin);
    if (!document) throw Error("unexpected error");
    await db.commit();
    res.send(document);
  } catch (error) {
    await db.rollback((err) => console.log(err));

    res.send(`internal error during saving document ${error}`);
  }
});

const validate = (req) => {
  const schema = Joi.object({
    doc_no: Joi.string().max(50).required(),
    subject: Joi.string().max(255).required(),
    description: Joi.string(),
    content: Joi.string().required(),
    origin: Joi.number().min(0).required(),
    recipient: Joi.number().min(0).required(),
  });
  return schema.validate(req);
};

module.exports = router;
