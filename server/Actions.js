const express = require("express");
const router=express.Router();
const db = require("./database");

//get the notifications that should be displayed for a student
router.get("/myActions", (req, res) => {
    const studentNr = req.query["studentID"];
    console.log(studentNr);
    const sqlSelect ='select * from actions where student_id=? and seen="false";';
    db.query(sqlSelect, [studentNr], (err, result) => {
      if (err != null) {
        console.log(err);
      } 
      else {
        res.send(result);
      }
    });
});

//set notification to seen so that it doesn't appear in notification centre anymore
router.post('/viewAction', (req, res) => {
    const actionId = req.body.actionID;
    const sqlUpdate = "Update actions set seen='true' where action_id=?";
    db.query(sqlUpdate, [actionId], (err, result) => {
      if (err != null) {
        console.log(err)
      }
      res.send(result);
    })
});

module.exports=router;