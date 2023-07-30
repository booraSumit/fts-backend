const { db } = require("../startup/db");
const bcrypt = require("bcrypt");

async function createDummyDepartment() {
  let p = "12345678";
  for (let i = 0; i < 20; i++) {
    const salt = await bcrypt.genSalt(10);
    const passoword = await bcrypt.hash(p, salt);
    const query = `    INSERT INTO Department (name, abr, description, password,user_name)
        VALUES (CONCAT('Department ', ?), CONCAT('Dept', ?), CONCAT('Description of Department ', ?), ?,CONCAT('user ',?));`;
    db.query(query, [i, i, i, passoword, i], (error, result, fields) => {
      if (error) return console.error(error.message);
      console.log(result);
    });
  }
}

createDummyDepartment();
