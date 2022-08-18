const mysql = require("mysql2");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "password",
    database: "sddatabase",
  
  });

module.exports=db;