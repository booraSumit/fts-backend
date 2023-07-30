const mysql = require("mysql2/promise");

// MySQL database connection configuration
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "1234",
  database: "fts",
};

// Create a single Promise-based connection and export it
let db;

// Log a message when the connection is established
const connectDB = async () => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log("Connected to the MySQL server.");
    db = connection;
  } catch (err) {
    console.error("Error connecting to the MySQL server:", err.message);
    throw err;
  }
};

module.exports = {
  connectDB,
  getDB: () => db,
};
