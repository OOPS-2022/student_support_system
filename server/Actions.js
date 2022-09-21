function Actions(database){
  const express = require("express");
  const router=express.Router();
  // const db = require("./database");
  
  //get the notifications that should be displayed for a student
  router.get("/myActions", (req, res) => {
      const studentNr = req.query["studentID"];
      // console.log(studentNr);
      database.myActions(studentNr, function(err, result){
        res.send(result);
      });
  });
  
  //set notification to seen so that it doesn't appear in notification centre anymore
  router.post('/viewAction', (req, res) => {
      const actionId = req.body.actionID;
      database.viewAction(actionId, function(err, result){
        res.send(result);
      });
  });

  return router;
}


module.exports=Actions;