function manageOffences(database){


  const express = require("express");
  const router=express.Router();
  // const db = require("./database");

  // get request to get list of possible offences, used to display clickable editable table
  router.get("/PossibleOffences", (req, res) => {
      database.PossibleOffences(function(err, result){
        res.send(result);
      })
  });
    
  //fetch the data from the database to send to frontend to show support staff all the offences that they or are a collaborator of have been logged
  router.post("/SubmittedOffences", (req, res) => {
    if(Object.keys(req.body).length < 1){
      res.send(null);
    }else{
      const user_id = req.body.user_id;
      database.SubmittedOffences(user_id,function(err , result) {
        res.send(result);
      });
    }
  });

  //
  router.post("/AllSubmittedOffences", (req, res) => {
      database.AllSubmittedOffences(function(err , result) {
        res.send(result);
      });
    }
  );
    
  // //do we still use this or is it the same as possible offences??
  router.get("/offences", (req, res) => {
    database.PossibleOffences(function(err, result){
      res.send(result);
    })
  });
    
  //post request to insert a new offence to the database
  router.post("/insert", (req, res) => {
      if(Object.keys(req.body).length < 3){
        res.send(null);
      }else{
        const offenceName = req.body.offenceName;
        const severity = req.body.severity;
        const desc = req.body.desc;
        database.insert(offenceName, severity, desc, function(err, result){
          res.send(result);
        })
      }
  });
    
  //do we still use this??
  router.get("/selectOffence", (req, res) => {
      const ticket_id = req.query["ticket_id"];
      database.selectOffence(ticket_id, function(err, result){
        res.send(result);
      })
  });
    
  //query called when a possible offence get deleted
  router.post("/delete", (req, res) => {
      const offenceId = req.body.offenceId;
      database.deleteOffence(offenceId, function(err, result){
        res.send(result);
      })
  });
    
  //query called a possible offence is edited
  router.post("/update", (req, res) => {
      const offenceName = req.body.offenceName;
      const severity = req.body.severity;
      const desc = req.body.desc;
      const offenceId = req.body.offenceId;
      database.update(severity, offenceName, desc, offenceId, function(err, result){
        res.send(result);
      })
  });

  return router;
}

module.exports=manageOffences;