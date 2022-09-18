function Checklist(database){

  const express = require("express");
  const router=express.Router();

  //adding a checklist
  router.get("/addCheckList", (req, res) => {
      database.addCheckList(function(err, result){
        res.send(result);
      })
  });
    
  //adding a question
  router.post("/addCheckListQuestion", (req, res) => {
    if(Object.keys(req.body).length != 3){
      res.send(null);
    }else{
      const session_id = req.body.session_id;
      const checklist_id = req.body.checklist_id;
      const question_details = req.body.question_details;
      database.addCheckListQuestion(checklist_id, session_id, question_details,function(err, result){
        res.send(result);
      })
    }
  });
    
  //getting all questions associated with a checklist
  router.post("/allCheckListQuestions", (req, res) => {
    if(Object.keys(req.body).length != 2){
      res.send(null);
    }else{
      const session_id = req.body.session_id;
      const checklist_id = req.body.checklist_id;
      database.allCheckListQuestions(session_id, checklist_id,function(err, result){
        res.send(result);
      })
    }
  });
    
  //get all checklists
  router.get("/CheckLists", (req, res) => {
    database.CheckLists(function(err, result){
      res.send(result);
    })
  });
    
  //get the checklist id 
  router.post("/viewCheck_id", (req, res) => {
    if(Object.keys(req.body).length != 1){
      res.send(null);
    }else{
      const session_id = req.body.session_id;
      database.viewCheck_id(session_id,function(err, result){
        res.send(result);
      })
    }
  });
    
  //update the question in the checklist
  router.post("/updateCheckListQuestion", (req, res) => {
    if(Object.keys(req.body).length != 4){
      res.send(null);
    }else{
      const question_num = req.body.question_num;
      const session_id = req.body.session_id;
      const checklist_id = req.body.checklist_id;
      const question_details = req.body.question_details;
      // console.log(question_details);
      database.updateCheckListQuestion(question_details, checklist_id, question_num, session_id, function(err, result){
        res.send(result);
      })
    }
  });
    
  //delete a question from a checklist
  router.post("/deleteCheckListQuestion", (req, res) => {
    if(Object.keys(req.body).length != 3){
      res.send(null);
    }else{
      const question_num = req.body.question_num;
      const session_id = req.body.session_id;
      const checklist_id = req.body.checklist_id;
      database.deleteCheckListQuestion(checklist_id, question_num, session_id, function(err, result){
        res.send(result);
      })
    }
  });
    
  //get the answers that students filled in with the checklists
  router.get("/getChecklistAns", (req, res) => {
    database.getChecklistAns( function(err, result){
      res.send(result);
    })
  });
    
  //insert the answers students answered in the checklist into the database
  router.post('/studentChecklistAnswers', (req, res)=>{
    if(Object.keys(req.body).length != 4){
      res.send(null);
    }else{
      const studentID=req.body.studentID;
      const checkID=req.body.checkID;
      const questions=req.body.questions;
      const answers=req.body.answers;
      database.studentChecklistAnswers( checkID, studentID,questions, answers,function(err, result){
       // res.send(result);
      })
    }
  });
    
  //get checklists associated with session
  router.get('/ckecklistForSession' ,(req,res)=>{
    if(Object.keys(req.query).length != 1){
      res.send(null);
    }else{
      const sessionId=req.query['session_id'];
      database.ckecklistForSession( sessionId,function(err, result){
        res.send(result);
      })
    }
  });

  return router
}
module.exports=Checklist;