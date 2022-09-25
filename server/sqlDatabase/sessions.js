const { Router } = require("express");

function createTest(testName, testDate, courseCode, creatorID, dir, pledgeID, callback , db){
    const sqlInsert ="INSERT INTO tests (test_name, test_date, course_code, creator_id, test_link, pledge_id) VALUES (?,?,?,?,?,?);"; // insert into test table
    db.query(sqlInsert, [testName, testDate, courseCode, creatorID, dir, pledgeID], (err, res) => {
        if (err != null) {
            callback(err , null)
          }else{
            callback(null , 200)
          }
      }
    );
}

function sessionPledgeLink(id, callback , db){
    const sqlSelect = "SELECT pledge_link from pledges where pledge_id= ?"; //get link where pledge is stored
    db.query(sqlSelect, [id], (error, result) => {
      //res.send(result);
      //console.log(result[0].pledge_link)
      if (error != null) {
        callback(error , null)
      }else{
        callback(null , result)
      }
    });
}

function submitSession(studentID ,paragraph ,sessionID,pledgeID , callback , db){
    const sqlSelect = "select organization_nr from users where user_id =?"; //student nr
      db.query(sqlSelect, [studentID], (error, result) => {
        // console.log(error);
        const studentNr = result[0].organization_nr;
        if (error != null) {
          callback(error , null)
        }else{
          callback(null , studentNr)
        }
        
      });
}

function selectSession_folder(sessionID , callback , db){
    const sqlSelectURL ="select session_folder from sessions where session_id=?"; //extend to sessions
    db.query(sqlSelectURL, [sessionID], (error, result) => {
        if (error != null) {
            callback(error , null)
        }else{
            callback(null , result)
        }
    });
}

function insertCompleted_sessions(studentID, sessionID, pledgeID, saveLink, paragraph, callback , db){
    const sqlInsert ="INSERT INTO completed_sessions (student_id, session_id,pledge_id, pledge_link, paragraph) VALUES (?,?,?,?,?);"; // insert into submisisons table
    db.query(sqlInsert, [studentID, sessionID, pledgeID, saveLink, paragraph], (err, res) => {
        if (err != null) {
            callback(err , null)
        }else{
            callback(null , 200)
        }
      }
    );
}

function testReport(id, callback, db){
  const sqlSelect ="select organization_nr, name, surname, paragraph from pledge_submissions left join users on user_id = student_id where test_id=?";
  db.query(sqlSelect, [id], (error, result) => {
    if (err != null) {
      callback(err , null)
    }else{
        callback(null , result)
    }
  });
}

function insertses(course_id, session_type, date, time, session_name, creator_id,pledges , callback , db){
  const sqlInsert = "Insert into sessions (course_id,session_type,date,time,session_name, creator_id) values(?,?,?,?,?,?)";
  db.query(sqlInsert, [course_id, session_type, date, time, session_name, creator_id], (err, result) => {
    if (err != null) {
        callback(err , null)
        console.log(err)
        return;
    }
    else {
      const sqlGetId = "SELECT session_id FROM sessions ORDER BY session_id DESC LIMIT 1";//get last  created session
      db.query(sqlGetId, (err, result) => {
        if (err != null) {
          callback(err , null)
        }else{
          callback(null , result[0].session_id)
        }
        //get all the students that the session will be applicable to
      })
    }
  });
}

function insertsesCont(session_id,pledges, callback , db){
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
          callback(err , null)
          return;
        }
      })
    }
    //linking all the pledes associated with a session to the session ID
    const sqlInsertSesLink = 'Insert into session_link (session_id, pledge_id) values (?,?)';
    for (let j = 0; j < pledges.length; j++) {
      db.query(sqlInsertSesLink, [session_id, pledges[j]], (err, result) => {
        if (err != null) {
          callback(err , null)
          return;
        }
      })
    }
    callback(null,null);
  })
}

function insertsesUpdateLink(saveLink, session_id, callback , db){
  //now insert this directory into database
  const sqlUpdateLink = 'Update sessions set session_folder=? where session_id=?';
  db.query(sqlUpdateLink, [saveLink, session_id], (err, result) => {
    if (err != null) {
      callback(err , null)
    }else{
      callback(null , 200)
    }
  })
}

function sessions(callback , db){
  const sqlSelect = "select * from sessions";
  db.query(sqlSelect, (err, result) => {
    if (err != null) {
      callback(err , null)
    }else{
      callback(null , result)
    }
  });
}

function getSession(session_id, callback , db){
  const sqlSelect = "select * from sessions where session_id=?";
  db.query(sqlSelect, [session_id], (err, result) => {
    if (err != null) {
      callback(err , null)
    }else{
      callback(null , result)
    }
  });
}

function updateses(date, time, session_name, session_id , callback , db){
  const sqlSelect ="UPDATE sessions SET date = ?, time =?, session_name=? WHERE session_id = ?";
  db.query(sqlSelect, [date, time, session_name, session_id], (err, result) => {
    if (err != null) {
      callback(err , null)
    }else{
      callback(null , 200)
    }
  });
}


function mySessions(studentID, callback , db){
 const sqlSelect  = 'select sessions.session_id, session_type, course_name, course_code, date,time from sessions left join session_link on sessions.session_id=session_link.session_id left join course_link on sessions.course_id=course_link.course_id left join student_link on course_link.pro_id=student_link.program_id left join courses on course_link.course_id=courses.course_id where user_id=?';
  db.query(sqlSelect, [studentID], (err, result) => {
    if (err != null) {
      callback(err , null)
    }else{
      callback(null , result)
    }
  })
}

function getAllSessions(callback , db){
  const sqlQuerry = "Select session_type, date,session_id  from sessions;";
  db.query(sqlQuerry, (error, result) => {
    if (error != null) {
      callback(error , null);
    }else{
      console.log(callback)
      callback(null , result);
    }
  });
}

function sessionPledges(session_id,callback , db){
  const sqlSelect ="select * from session_link left join pledges on session_link.pledge_id=pledges.pledge_id left join sessions on session_link.session_id =sessions.session_id where sessions.session_id=?";
  db.query(sqlSelect, [session_id], (err, result) => {
    if (err != null) {
      callback(err , null)
    }else{
      callback(null , result)
    }
  });

}
module.exports= {sessions,getSession, updateses ,mySessions ,mySessions ,getAllSessions, sessionPledges ,insertses, insertsesCont, insertsesUpdateLink, testReport, selectSession_folder,insertCompleted_sessions,submitSession,sessionPledgeLink,createTest};
