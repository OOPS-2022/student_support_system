function Session(database){
  const express = require("express");
  const router=express.Router();
  const multer = require("multer");
  const fs = require("fs");
  const uploadStudentPledge = multer({ dest: "./Uploads/SubmittedSessions" });

  ///create a test and add a pledge...!!!!!extend to sessions
  router.post("/createTest", (req, res) => {
    if(Object.keys(req.body).length != 2){
      res.send(null);
    }else{
      const testName = req.body.testName;
      const pledgeID = req.body.pledgeID;
      const courseCode = req.body.courseCode;
      const testDate = req.body.testDate;
      const creatorID = req.body.creatorID;
      const dir = "./Uploads/Pledges/Test/" + testName + courseCode; //create directory for test...uploads will happen here
      fs.mkdir(dir, (err) => {
        if (!err) {
          database.createTest(testName, testDate, courseCode, creatorID, dir, pledgeID,function(err, result){
            res.send(result);
          })
        }else{
          res.send(null);
        }
      });
      
    }
  });
    
  //get pledge associated with session
  router.get("/sessionPledgeLink", function (req, res) {
    if(Object.keys(req.query).length != 1){
      res.send(null);
    }else{
      const id = req.query["pledge_id"]; //gets id from frontend
      database.sessionPledgeLink(id,function(err, result){
        if (err != null) {
          console.log(err);
          res.send(null);
          return;
        }
        const filePath = result[0].pledge_link;
    
        fs.readFile(__dirname + filePath, function (err, data) {
          if(err == null){
            res.contentType("application/pdf");
            res.send(data);
          }else{
            res.send(null);
          }
        });
      })
    }
  });
    
  ///student ability to complete sessions
  router.post("/submitSession", uploadStudentPledge.single("file"), (req, res) => {
    //uploading the pledge that student signed before test
    //get student nr from database and then do upload!!!!
    if(Object.keys(req.body).length != 4){
      res.send(null);
    }else{
      const studentID = req.body.studentID;
      const paragraph = req.body.paragraph;
      const sessionID = req.body.sessionID;
      const pledgeID = req.body.pledgeID;
      database.submitSession(studentID ,paragraph ,sessionID,pledgeID,function(err, result){
        if(err == null){
          const studentNr = result[0].organization_nr;
          database.selectSession_folder(sessionID ,function(err, result){
            if(err == null){
              const sessionLink = result[0].session_folder;
        
              let newFileName = studentNr + ".pdf";
              let oldPath = "./Uploads/SubmittedSessions/" + req.file.filename;
              let newPath = sessionLink + "/" + newFileName;
              let saveLink = newPath.slice(1);
              fs.rename(oldPath, newPath, function (err) {
                if(err == null){
                  database.insertCompleted_sessions(studentID, sessionID, pledgeID, saveLink, paragraph,function(err, result){
                    res.send(result);
                  })
                }else{
                  res.send(null);
                }
              });
            }else{
              res.send(null);
            }
          })
        }else{
          res.send(null);
        }
      })
    } 
  });
    

  //give admin a report of students that completed test...extend to sessions
  router.get("/testReport", (req, res) => {
      ///this is to display which students have completed the pledge
      const id = req.query["testID"];
      database.testReport(id,function(err, result){
        res.send(result);
      })
  });
    
  //adding a session
  router.post("/insertses", (req, res) => {
    if(Object.keys(req.body).length != 7){
      res.send(null);
    }else{
      const course_id = req.body.course_id;
      const session_type = req.body.sestype;
      const date = req.body.date;
      const time = req.body.time;
      const session_name = req.body.session_name;
      const creator_id = req.body.creator_id;
      const pledges = req.body.pledges;
      //console.log(pledges);
      database.insertses(course_id, session_type, date, time, session_name, creator_id,pledges ,function(err, result){
        if(err == null){
          var session_id = result
          database.insertsesCont(session_id,pledges,function(err, result){
            if(err == null){
              var session_id = result
              const dir = './Uploads/SubmittedSessions/Session' + session_id;
              fs.mkdir(dir, err => {
                if (err == null) {
                    database.insertsesUpdateLink(dir, session_id, function(err, result){
                    res.send(result);
                  })
                }
              })
            }
          })
        }
      })
    }
  });
    
    
  //view all the sessions...if admin..show only created by certain admin? why would they change others' stuff?
  router.get("/sessions", (req, res) => {
    database.sessionss(function(err, result){
      res.send(result);
    })
  });
    
  //view a single session when you click on it
  router.get("/getSession", (req, res) => {
      const session_id = req.query["session_id"];
      database.getSession(session_id,function(err, result){
        res.send(result);
      })
  });
    
  //updating session
  router.post("/updateses", (req, res) => {
    if(Object.keys(req.body).length != 4){
      res.send(null);
    }else{
      const session_id = req.body.session_id;
      const date = req.body.date;
      const time = req.body.time;
      const session_name = req.body.session_name;
      //console.log(req.body);
      database.updateses(date, time, session_name, session_id , function(err, result){
        res.send(result);
      })
    }
  });
    
  //see all sessions associated with that student
  router.get('/mySessions', (req, res) => {
      const studentID = req.query['studentID'];
      database.mySessions( studentID, function(err, result){
        res.send(result);

      })
  });
    
  router.get("/getAllSessions", (req, res) => {
    database.getAllSessions(function(err, result){
      res.send(result);
    })
  });

  //get all the pledges associated with a session
  router.get("/sessionPledges", (req, res) => {
      const session_id = req.query["select_id"];
      database.sessionPledges( session_id,function(err, result){
        res.send(result);
      })
  });

  return router;
}


module.exports=Session;