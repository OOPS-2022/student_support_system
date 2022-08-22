const express = require("express");
const router=express.Router();
const db = require("./database");

//adding a checklist
router.get("/addCheckList", (req, res) => {
    const sqlGetId ="SELECT check_id FROM checklist ORDER BY check_id DESC LIMIT 1"; //get last  created checklist id
    db.query(sqlGetId, (err, result) => {
      res.send(result[0]);
      // console.log(result[0])
    });
});
  
//adding a question
router.post("/addCheckListQuestion", (req, res) => {
    const session_id = req.body.session_id;
    const checklist_id = req.body.checklist_id;
    const question_details = req.body.question_details;
  
    const sqlGetId ="SELECT question_number FROM checklist WHERE check_id = ? AND session_id = ? ORDER BY question_number DESC LIMIT 1"; //get last  created checklist id
    db.query(sqlGetId, [checklist_id, session_id], (err, result) => {
      console.log(result);
      let question_num;
      if (result.length == 0) {
        question_num = 1;
      } 
      else {
        question_num = result[0].question_number + 1;
      }
  
      const sqlInsert ="Insert into checklist (check_id, question_number, question_details, session_id) values (?, ?, ?, ?)";
      db.query(sqlInsert, [checklist_id, question_num, question_details, session_id], (err, result) => {
          if (err != null) {
            console.log(err);
          }
        }
      );
    });
});
  
//getting all questions associated with a checklist
router.post("/allCheckListQuestions", (req, res) => {
    const session_id = req.body.session_id;
    const checklist_id = req.body.checklist_id;
    const sqlGetId ="SELECT * FROM checklist WHERE session_id = ? AND check_id = ?";
    db.query(sqlGetId, [session_id, checklist_id], (err, result) => {
      res.send(result);
    });
});
  
//get all checklists
router.get("/CheckLists", (req, res) => {
    const sqlSelect ="select check_id, question_number, question_details,session_id from checkList";
    db.query(sqlSelect, (error, result) => {
      res.send(result);
    });
});
  
//get the checklist id 
router.post("/viewCheck_id", (req, res) => {
    const session_id = req.body.session_id;
    // const checklist_id = req.body.checklist_id;
    // console.log(session_id)
    const sqlSelect ="select distinct check_id from checklist WHERE session_id = ?";
    db.query(sqlSelect, [session_id], (error, result) => {
      res.send(result);
    });
});
  
//update the question in the checklist
router.post("/updateCheckListQuestion", (req, res) => {
    const question_num = req.body.question_num;
    const session_id = req.body.session_id;
    const checklist_id = req.body.checklist_id;
    const question_details = req.body.question_details;
    console.log(question_details);
    const sqlUpdate ="Update checklist set question_details = ? where check_id = ? AND question_number= ? AND session_id = ?";
    db.query(sqlUpdate, [question_details, checklist_id, question_num, session_id], (err, result) => {
        if (err != null) {
          console.log(err);
        }
      }
    );
});
  
//delete a question from a checklist
router.post("/deleteCheckListQuestion", (req, res) => {
    const question_num = req.body.question_num;
    const session_id = req.body.session_id;
    const checklist_id = req.body.checklist_id;
    const sqlSelect ="Delete from checklist where check_id = ? AND question_number= ? AND session_id = ?";
    db.query(sqlSelect, [checklist_id, question_num, session_id], (err, result) => {
        if (err == null) {
          console.log("deleted");
          res.send("deleted");
        }
      }
    );
});
  
//get the answers that students filled in with the checklists
router.get("/getChecklistAns", (req, res) => {
    const sqlQuerry ="select users.name, users.surname, users.organization_nr, filledchecklist.checklist_id, filledchecklist.stu_id, filledchecklist.question_number, filledchecklist.checked, checklist.session_id from filledchecklist, checklist, users where filledchecklist.checklist_id = checklist.check_id and checklist.question_number = filledchecklist.question_number and users.user_id=filledchecklist.stu_id order by session_id, stu_id;";
  
    db.query(sqlQuerry, (error, result) => {
      res.send(result);
    });
});
  
//insert the answers students answered in the checklist into the database
router.post('/studentChecklistAnswers', (req, res)=>{
    const studentID=req.body.studentID;
    const checkID=req.body.checkID;
    const questions=req.body.questions;
    const answers=req.body. questions;
  
    const sqlInsert="Insert into filledchecklist (checklist_id, stu_id, question_number, checked) values (?,?,?,?)";
  
    for (let i=0; i<questions.length;i++){
      db.query(sqlInsert, [checkID, studentID,questions[i], answers[i]], (err,result)=>{
        if (err!=null){
          console.log(err)
        }
      })
      res.send('successful')
    }
});
  
//get checklists associated with session
router.get('/ckecklistForSession' ,(req,res)=>{
    const sessionId=req.query['session_id'];
    const sqlSelect='SELECT * from checklist where session_id=?';
  
    db.query(sqlSelect, [sessionId], (err,result)=>{
      if (err!=null){
        console.log(err)
      }
      else{
        res.send(result)
      }
    })
});

module.exports=router;