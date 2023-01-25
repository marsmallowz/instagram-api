const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "instagram",
});

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("DB Connected");
  }
});

module.exports = db;
