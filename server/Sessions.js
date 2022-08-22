const express = require("express");
const router=express.Router();
const db = require("./database");
const multer = require("multer");
const fs = require("fs");
const uploadStudentPledge = multer({ dest: "./Uploads/SubmittedSessions" });

///create a test and add a pledge...!!!!!extend to sessions
router.post("/createTest", (req, res) => {
    const testName = req.body.testName;
    const pledgeID = req.body.pledgeID;
    const courseCode = req.body.courseCode;
    const testDate = req.body.testDate;
    const creatorID = req.body.creatorID;
    const dir = "./Uploads/Pledges/Test/" + testName + courseCode; //create directory for test...uploads will happen here
    fs.mkdir(dir, (err) => {
      if (err) {
        throw err;
      }
    });
    const sqlInsert ="INSERT INTO tests (test_name, test_date, course_code, creator_id, test_link, pledge_id) VALUES (?,?,?,?,?,?);"; // insert into test table
    db.query(sqlInsert, [testName, testDate, courseCode, creatorID, dir, pledgeID], (err, res) => {
        if (err != null) {
          console.log(err);
        }
      }
    );
});
  
//get pledge associated with session
router.get("/sessionPledgeLink", function (req, res) {
    //var filePath = "/Uploads/Pledges/SignedPledges/1650355918774Plagiarism Pledge.pdf"; //this will be what gets saved in database
    const id = req.query["pledge_id"]; //gets id from frontend
    //var filePath1;
    const sqlSelect = "SELECT pledge_link from pledges where pledge_id= ?"; //get link where pledge is stored
    db.query(sqlSelect, [id], (error, result) => {
      //res.send(result);
      //console.log(result[0].pledge_link)
      const filePath = result[0].pledge_link;
      if (error != null) {
        console.log(error);
      }
  
      fs.readFile(__dirname + filePath, function (err, data) {
        res.contentType("application/pdf");
        res.send(data);
        //console.log(__dirname);
      });
    });
});
  
///student ability to complete sessions
router.post("/submitSession", uploadStudentPledge.single("file"), (req, res) => {
    //uploading the pledge that student signed before test
    //get student nr from database and then do upload!!!!
    const studentID = req.body.studentID;
    const paragraph = req.body.paragraph;
    const sessionID = req.body.sessionID;
    const pledgeID = req.body.pledgeID;
  
    const sqlSelect = "select organization_nr from users where user_id =?"; //student nr
    db.query(sqlSelect, [studentID], (error, result) => {
      console.log(error);
      const studentNr = result[0].organization_nr;
  
      const sqlSelectURL ="select session_folder from sessions where session_id=?"; //extend to sessions
      db.query(sqlSelectURL, [sessionID], (error, result) => {
        const sessionLink = result[0].session_folder;
  
        let newFileName = studentNr + ".pdf";
        let oldPath = "./Uploads/SubmittedSessions/" + req.file.filename;
        let newPath = sessionLink + "/" + newFileName;
        let saveLink = newPath.slice(1);
        fs.rename(oldPath, newPath, function (err) {
          console.log(err);
          res.send("200");
        });
  
        const sqlInsert ="INSERT INTO completed_sessions (student_id, session_id,pledge_id, pledge_link, paragraph) VALUES (?,?,?,?,?);"; // insert into submisisons table
        db.query(sqlInsert, [studentID, sessionID, pledgeID, saveLink, paragraph], (err, res) => {
            if (err != null) {
              console.log(err);
            }
          }
        );
      });
    });
});
  
//give admin a report of students that completed test...extend to sessions
router.get("/testReport", (req, res) => {
    ///this is to display which students have completed the pledge
    const id = req.query["testID"];
    const sqlSelect ="select organization_nr, name, surname, paragraph from pledge_submissions left join users on user_id = student_id where test_id=?";
    db.query(sqlSelect, [id], (error, result) => {
      res.send(result);
    });
});
  
//adding a session
router.post("/insertses", (req, res) => {
  
    const course_id = req.body.course_id;
    const session_type = req.body.sestype;
    const date = req.body.date;
    const time = req.body.time;
    const session_name = req.body.session_name;
    const creator_id = req.body.creator_id;
    const pledges = req.body.pledges;
    //console.log(pledges);
    const sqlInsert = "Insert into sessions (course_id,session_type,date,time,session_name, creator_id) values(?,?,?,?,?,?)";
    db.query(sqlInsert, [course_id, session_type, date, time, session_name, creator_id], (err, result) => {
      if (err != null) {
        res.send(err)
        console.log(err);
      }
      else {
        const sqlGetId = "SELECT session_id FROM sessions ORDER BY session_id DESC LIMIT 1";//get last  created session
        db.query(sqlGetId, (err, result) => {
          let session_id = result[0].session_id;
          //get all the students that the session will be applicable to
          const sqlGetStudents = "select user_id from sessions left join session_link on sessions.session_id=session_link.session_id left join course_link on sessions.course_id=course_link.course_id left join student_link on course_link.pro_id=student_link.program_id where sessions.session_id=?;"
          db.query(sqlGetStudents, [session_id], (err, result) => {
            //console.log(result);
            for (let i = 0; i < result.length; i++) {
              let student_id = result[i].user_id;
              let table = "sessions";
              let tableID = session_id;
              let seen = "false";
              let date = new Date().toISOString().slice(0, 10);
              let actionDesc = "A new session has been uploaded";
              const sqlInsert = "Insert into actions (student_id, tables, table_id, seen, date, action_desc) values (?, ?, ?, ?, ?, ?)"; //send notification to every student
              db.query(sqlInsert, [student_id, table, tableID, seen, date, actionDesc], (err, result) => {
                if (err != null) {
                  console.log(err)
                }
              })
            }
            //linking all the pledes associated with a session to the session ID
            const sqlInsertSesLink = 'Insert into session_link (session_id, pledge_id) values (?,?)';
            for (let j = 0; j < pledges.length; j++) {
              db.query(sqlInsertSesLink, [session_id, pledges[j]], (err, result) => {
                if (err != null) {
                  console.log(err);
                }
              })
            }
  
            const dir = './Uploads/SubmittedSessions/Session' + session_id;
            const saveLink = './Uploads/SubmittedSessions/Session' + session_id;
            fs.mkdir(dir, err => {
              if (err) {
                throw err;
              }
            })
            //now insert this directory into database
            const sqlUpdateLink = 'Update sessions set session_folder=? where session_id=?';
            db.query(sqlUpdateLink, [saveLink, session_id], (err, result) => {
              if (err != null) {
                console.log(err)
              }
              else{
                res.send('successful')
              }
            })
  
  
          })
        })
      }
    });
});
  
  
//view all the sessions...if admin..show only created by certain admin? why would they change others' stuff?
router.get("/sessions", (req, res) => {
    const sqlSelect = "select * from sessions";
    db.query(sqlSelect, (err, result) => {
      if (err != null) {
        console.log(err);
      } else {
        //console.log(result)
        res.send(result);
      }
    });
});
  
//view a single session when you click on it
router.get("/getSession", (req, res) => {
    const session_id = req.query["session_id"];
    const sqlSelect = "select * from sessions where session_id=?";
    db.query(sqlSelect, [session_id], (err, result) => {
      if (err != null) {
        console.log(err);
      } 
      else {
        console.log(result);
        res.send(result);
      }
    });
});
  
//updating session
router.post("/updateses", (req, res) => {
    const session_id = req.body.session_id;
    const date = req.body.date;
    const time = req.body.time;
    const session_name = req.body.session_name;
    //console.log(req.body);
    const sqlSelect ="UPDATE sessions SET date = ?, time =?, session_name=? WHERE session_id = ?";
    db.query(sqlSelect, [date, time, session_name, session_id], (err, result) => {
      console.log(err);
      res.send("update");
    });
});
  
//see all sessions associated with that student
router.get('/mySessions', (req, res) => {
    const studentID = req.query['studentID'];
    const sqlSelect = 'select sessions.session_id,session_type, course_name, course_code, date,time from sessions left join session_link on sessions.session_id=session_link.session_id left join course_link on sessions.course_id=course_link.course_id left join student_link on course_link.pro_id=student_link.program_id left join courses on course_link.course_id=courses.course_id where user_id=?';
    db.query(sqlSelect, [studentID], (err, result) => {
      if (err != null) {
        console.log(err)
      }
      else {
        res.send(result)
      }
    })
});
  
router.get("/getAllSessions", (req, res) => {
    const sqlQuerry = "Select session_type, date,session_id  from sessions;";
    db.query(sqlQuerry, (error, result) => {
      res.send(result);
      // console.log(result);
    });
});

//get all the pledges associated with a session
router.get("/sessionPledges", (req, res) => {
    const session_id = req.query["select_id"];
    const sqlSelect ="select * from session_link left join pledges on session_link.pledge_id=pledges.pledge_id left join sessions on session_link.session_id =sessions.session_id where sessions.session_id=?";
    db.query(sqlSelect, [session_id], (err, result) => {
      if (err != null) {
        console.log(err);
      } 
      else {
        res.send(result);
      }
    });
});

module.exports=router;