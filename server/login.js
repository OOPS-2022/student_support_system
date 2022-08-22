const express = require("express");
const router=express.Router();
const db = require("./database");

router.post("/Login", (req, res) => {
    const setlgEmail = req.body.setlgEmail;
    const setlgPassword = req.body.setlgPassword;
    const sqlLgget =
      "Select user_id, role from users where email = ? and password = ?";
    db.query(sqlLgget, [setlgEmail, setlgPassword], (err, result) => {
      if (!result?.[0]) {
        //if there is no result
        res.send("incorrect");
      } else {
        res.send(result); //send through data to store in session storage
      }
    });
  });

module.exports=router;

