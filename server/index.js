const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");
const nodemailer = require("nodemailer");
const multer = require("multer");
const uploadSignedPledge = multer({ dest: "./Uploads/Pledges/SignedPledges" });
const uploadStudentPledge = multer({ dest: "./Uploads/SubmittedSessions" });
const fs = require("fs");
const { dirname } = require("path");
const uploadEvidenceDoc = multer({ dest: "./Uploads/Evidence" });

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "sddatabase",

});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//------------------------------------------------------------login
app.post("/Login", (req, res) => {
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
//-------------------------------------------------------------end login

//log an offence when evidence hasn't been submitted (evidence optional)
app.post("/LogOffenceNoFile", (req, res) => {
  // post request to add a log
  const offenderName = req.body.offenderName;
  const offenceType = req.body.offenceType;
  const offenceDetails = req.body.offenceDetails;
  const offenceCode = req.body.offenceCode;
  const offenceOther = req.body.offenceOther;
  const submittedBy = req.body.submittedBy;
  const offenceStatus = req.body.offenceStatus;
  let offenceID;
  let ticket_id;
  console.log(req.body);
  const sqlSelect =
    "SELECT offence_id FROM offence_list WHERE offence_name = ?"; // get offence_id from table
  db.query(sqlSelect, [offenceType], (err, result) => {
    if (result[0] != null) {
      offenceID = result[0].offence_id;
      const sqlInsert =
        "INSERT INTO logged_offences ( offender_name, offence_id, details, crs_code, offence_status, submitter_id ) VALUES (?,?,?,?,?,?);"; // insert into log table
      db.query(
        sqlInsert,
        [
          offenderName,
          offenceID,
          offenceDetails,
          offenceCode,
          offenceStatus,
          submittedBy,
        ],
        (err, result) => {
          const sqlGetId =
            "SELECT * FROM logged_offences ORDER BY ticket_id DESC LIMIT 1"; // get ticket_id the ticket we just created
          db.query(sqlGetId, (err, result) => {
            ticket_id = result[0].ticket_id;
            const sqlInsert =
              "INSERT INTO other (ticket_id, offence_name) VALUES (?,?);"; // insert into log table
            if (offenceType === "other") {
              db.query(sqlInsert, [ticket_id, offenceOther], (err, result) => {
                if (err !== null) {
                  //if there is an error inserting into other, delete the offence from logged_offences
                  const sqlDelete =
                    "DELETE FROM logged_offences ORDER BY ticket_id DESC LIMIT 1";
                  db.query(sqlDelete, (err, result));
                  //res.send("Failed");
                  //return;
                }
              });
            }
            //create directory to store all evidence related to this ticket
            const dir = "./Uploads/Evidence/ticket" + ticket_id;
            const saveLink = "/Uploads/Evidence/ticket" + ticket_id;
            fs.mkdir(dir, (err) => {
              if (err) {
                throw err;
              }
            });
            //now insert this directory into database
            const sqlUpdateLink =
              "Update logged_offences set ticket_link=? where ticket_id=?";
            db.query(sqlUpdateLink, [saveLink, ticket_id], (err, result) => {
              if (err != null) {
                console.log(err);
              }
            });

            const sqlGetStudent =
              "select user_id from users where organization_nr=?"; //get student user id from database
            const sqlInsertAction =
              "Insert into actions (student_id, tables, table_id, seen, date, action_desc) values (?, ?, ?, ?, ?, ?)"; //this will allow the student to get an alert
            db.query(sqlGetStudent, [offenderName], (err, result) => {
              let student_id = result[0].user_id;
              let table = "logged_offence"; //this will later allow us to redirect the notifiaction to appropriate page
              let tableID = ticket_id;
              let seen = "false";
              let date = new Date().toISOString().slice(0, 10);
              let actionDesc = "An offence has been logged against you.";
              db.query(
                sqlInsertAction,
                [student_id, table, tableID, seen, date, actionDesc],
                (err, result) => {
                  if (err != null) {
                    console.log(err);
                  }
                }
              );
            });
          });
        }
      );
    }
  });

  //set up our email.
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "sdteamoops@gmail.com",
      pass: "SD1Team1OOPS!",
    },
    tls: {
      rejectUnauthorised: false,
    },
  });

  const sqlSelectEmail = "select email from users where organization_nr=?"; //get student email from database
  db.query(sqlSelectEmail, [offenderName], (err, result) => {
    offenderEmail = result[0].email;
    let mailOptions = {
      from: "sdteamoops@gmail.com",
      to: offenderEmail,
      subject: "Logged Offence",
      text:
        "This is an auto generated email.\nA student has reported an offence against you under the category of " +
        offenceType +
        ", an investigation into this case will follow.",
    };
    //send email to student to alert them that an offence has been logged against them
    transporter.sendMail(mailOptions, function (err, success) {
      if (err) {
        console.log(err);
        res.send("Unable to send email to offender");
      } else {
        console.log("Email sent to " + offenderEmail);
        res.send("Successful");
      }
    });
  });
});

//log an offence when a pdf file has been submitted as evidence
app.post("/LogOffence", uploadEvidenceDoc.single("file"), (req, res) => {
  // post request to add a log
  const offenderName = req.body.offenderName;
  const offenceType = req.body.offenceType;
  const offenceDetails = req.body.offenceDetails;
  const offenceCode = req.body.offenceCode;
  const offenceOther = req.body.offenceOther;
  const submittedBy = req.body.submittedBy;
  const offenceStatus = req.body.offenceStatus;
  let offenderEmail = req.body.offenderEmail;
  let offenceID;
  let ticket_id;
  console.log(req.body);
  const sqlSelect =
    "SELECT offence_id FROM offence_list WHERE offence_name = ?"; // get offence_id from table
  db.query(sqlSelect, [offenceType], (err, result) => {
    if (result[0] != null) {
      offenceID = result[0].offence_id;
      const sqlInsert =
        "INSERT INTO logged_offences ( offender_name, offence_id, details, crs_code, offence_status, submitter_id ) VALUES (?,?,?,?,?,?);"; // insert into log table
      db.query(
        sqlInsert,
        [
          offenderName,
          offenceID,
          offenceDetails,
          offenceCode,
          offenceStatus,
          submittedBy,
        ],
        (err, result) => {
          if (err != null) {
            res.send("Failed");
            return;
          } else {
            //create directory named for the ticket id
            const sqlGetId =
              "SELECT ticket_id FROM logged_offences ORDER BY ticket_id DESC LIMIT 1"; //get ticket
            db.query(sqlGetId, (err, result) => {
              ticket_id = result[0].ticket_id;
              const dir = "./Uploads/Evidence/ticket" + ticket_id;
              const saveLink = "/Uploads/Evidence/ticket" + ticket_id;
              fs.mkdir(dir, (err) => {
                if (err) {
                  throw err;
                }
              });
              //now insert this directory into database
              const sqlUpdateLink =
                "Update logged_offences set ticket_link=? where ticket_id=?";
              db.query(sqlUpdateLink, [saveLink, ticket_id], (err, result) => {
                if (err != null) {
                  console.log(err);
                }
              });
              //let fileType=req.file.mimetype.split("/")[1];

              //get the file sent through and save it in the directory just created
              let newFileName = Date.now() + req.file.originalname; //adding date ensures unique file name and lessens possibility of file loss and overwrites
              let oldPath = "./Uploads/Evidence/" + req.file.filename; //file path where it has been uploaded
              let newPath =
                "./Uploads/Evidence/ticket" + ticket_id + "/" + newFileName; //created directory that we want to move the file to
              fs.rename(oldPath, newPath, function (err) {
                console.log(err);
              });

              const sqlInsert =
                "INSERT INTO other (ticket_id, offence_name) VALUES (?,?);"; // insert into log table
              if (offenceType === "other") {
                db.query(
                  sqlInsert,
                  [ticket_id, offenceOther],
                  (err, result) => {
                    if (err !== null) {
                      //if failed to insert into other, delete from logged offence
                      const sqlDelete =
                        "DELETE FROM logged_offences ORDER BY ticket_id DESC LIMIT 1";
                      db.query(sqlDelete, (err, result));
                      res.send("Failed");
                      //return;
                    }
                  }
                );
              }
              const sqlGetStudent =
                "select user_id from users where organization_nr=?"; //get student user id from database
              const sqlInsertAction =
                "Insert into actions (student_id, tables, table_id, seen, date, action_desc) values (?, ?, ?, ?, ?, ?)"; //send action to student to get notification
              db.query(sqlGetStudent, [offenderName], (err, result) => {
                let student_id = result[0].user_id;
                let table = "logged_offence";
                let tableID = ticket_id;
                let seen = "false";
                let date = new Date().toISOString().slice(0, 10);
                let actionDesc = "An offence has been logged against you.";
                db.query(
                  sqlInsertAction,
                  [student_id, table, tableID, seen, date, actionDesc],
                  (err, result) => {
                    if (err != null) {
                      console.log(err);
                    }
                  }
                );
              });
            });
          }
        }
      );
    }
  });

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "sdteamoops@gmail.com",
      pass: "SD1Team1OOPS!",
    },
    tls: {
      rejectUnauthorised: false,
    },
  });

  const sqlSelectEmail = "select email from users where organization_nr=?";
  db.query(sqlSelectEmail, [offenderName], (err, result) => {
    offenderEmail = result[0].email;
    let mailOptions = {
      from: "sdteamoops@gmail.com",
      to: offenderEmail,
      subject: "Logged Offence",
      text:
        "This is an auto generated email.\nA student has reported an offence against you under the category of " +
        offenceType +
        ", an investigation into this case will follow.",
    };
    transporter.sendMail(mailOptions, function (err, success) {
      //send email to alert student that an offence has been logged against them
      if (err) {
        console.log(err);
        res.send("Unable to send email to offender");
      } else {
        console.log("Email sent to " + offenderEmail);
        res.send("Successful");
      }
    });
  });
});

//get request to get list of possible offences, used to display clickable editable table
app.get("/PossibleOffences", (req, res) => {
  const sqlSelect =
    "select offence_id,offence_name, severity ,offence_desc from offence_list where offence_name != 'other'";
  db.query(sqlSelect, (error, result) => {
    res.send(result);
  });
});

//fetch the data from the database to send to frontend to show admin all the offences that have been logged
app.get("/SubmittedOffences", (req, res) => {
  const sqlSelect =
    "select logged_offences.ticket_id, offender_name, (case when offence_list.offence_name='other' then other.offence_name else offence_list.offence_name end) as offence_name,crs_code , offence_status from logged_offences left join offence_list on logged_offences.offence_id= offence_list.offence_id left join other on logged_offences.ticket_id=other.ticket_id";
  db.query(sqlSelect, (error, result) => {
    res.send(result);
  });
});

//do we still use this or is it the same as possible offences??
app.get("/offences", (req, res) => {
  const sqlSelect =
    "select offence_id, offence_name from offence_list where offence_name != 'other'";
  db.query(sqlSelect, (error, result) => {
    res.send(result);
  });
});

//post request to insert a new offence to the database
app.post("/insert", (req, res) => {
  const offenceName = req.body.offenceName;
  const severity = req.body.severity;
  const desc = req.body.desc;
  const sqlSelect =
    "Insert into offence_list(offence_name, severity, offence_desc) values(?,?,?)";
  db.query(sqlSelect, [offenceName, severity, desc], (err, result) => {
    console.log(err);
    res.send("inserted");
  });
});

//do we still use this??
app.get("/selectOffence", (req, res) => {
  const ticket_id = req.query["ticket_id"];
  const sqlSelect = "select * from logged_offences where ticket_id = ?";
  db.query(sqlSelect, [ticket_id], (err, result) => {
    res.send(result[0]);
  });
});

//query called when a possible offence get deleted
app.post("/delete", (req, res) => {
  const offenceId = req.body.offenceId;
  const sqlSelect = "Delete from offence_list where offence_id = ?";
  db.query(sqlSelect, [offenceId], (err, result) => {
    if (err == null) {
      res.send("deleted");
    }
  });
});

//query called a possible offence is edited
app.post("/update", (req, res) => {
  const offenceName = req.body.offenceName;
  const severity = req.body.severity;
  const desc = req.body.desc;
  const offenceId = req.body.offenceId;
  const sqlSelect =
    "UPDATE offence_list SET severity = ?, offence_name =?, offence_desc=? WHERE offence_id = ?";
  db.query(
    sqlSelect,
    [severity, offenceName, desc, offenceId],
    (err, result) => {
      res.send("updated");
    }
  );
});

//query to view the pledges.
app.get("/viewPledges", (req, res) => {
  const sqlSelect =
    "select pledge_id, pledge_name, pledge_desc, pledge_type from pledges";
  db.query(sqlSelect, (error, result) => {
    res.send(result);
  });
});

//query to view pledge file if the pledge is a signed pledge
app.get("/viewFile", function (req, res) {
  //var filePath = "/Uploads/Pledges/SignedPledges/1650355918774Plagiarism Pledge.pdf"; //this will be what gets saved in database
  const id = req.query["id"]; //gets id from frontend
  //var filePath1;
  const sqlSelect = "select pledge_link from pledges where pledge_id = ?"; //link where pledge is saved
  db.query(sqlSelect, [id], (error, result) => {
    //res.send(result);
    const filePath = result[0].pledge_link;

    if (error != null) {
      console.log(error);
    }
    //read the file into a blob of content type pdf
    fs.readFile(__dirname + filePath, function (err, data) {
      res.contentType("application/pdf");
      res.send(data);
      //console.log(__dirname);
    });
  });
});

//get the amount of files that are in a directory for a ticket
app.get("/fileNumber", function (req, res) {
  const id = req.query["ticket_id"];
  let directory_name = "Uploads/Evidence/ticket" + id;
  let filenames = fs.readdirSync(directory_name);
  let result = filenames.length.toString();
  res.send(result);
});

//view the files stored as evidence for a ticket
app.get("/viewTicketFiles", function (req, res) {
  const id = req.query["id"];
  const i = req.query["i"]; //this is to do with the file number from app.get(filenumber)
  let directory_name = "Uploads/Evidence/ticket" + id; //get the directory since they are named for the ticket ids
  let filenames = fs.readdirSync(directory_name, { withFileTypes: true }); //get all the file names in directory
  let filePath = directory_name + "/" + filenames[i].name; //get the next file to create blob with
  fs.readFile(__dirname + "/" + filePath, function (err, data) {
    console.log(__dirname + "/" + filePath);
    res.contentType("application/pdf");
    console.log(err);
    res.send(data);
    //console.log(__dirname);
  });

  //console.log(__dirname);

  //let blob = new Blob([data], {type: 'application / PDF'});
});

//request to show the progress of how the ticket is being progressed
app.get("/ticketTracker", (req, res) => {
  const ticketID = req.query["ticketID"];
  const sqlSelect = "select * from investigation_record where ticket_id=?";
  db.query(sqlSelect, [ticketID], (err, result) => {
    if (err != null) {
      console.log(err);
    }
    res.send(result);
  });
});

//get all the hearings associated with the ticket. This will show the student when they have a hearing
app.get("/myHearing", (req, res) => {
  const ticket_id = req.query["ticket_id"];
  const sqlSelect = "select * from meetings where ticket_id=?";
  db.query(sqlSelect, [ticket_id], (err, result) => {
    if (err != null) {
      console.log(err);
    }
    res.send(result);
  });
});

//get all the offences logged against a certain student so that they can keep track of their investigations
app.get("/viewMyOffences", (req, res) => {
  const userID = req.query["userID"];
  const sqlSelectNr = "select organization_nr from users where user_id=?";
  db.query(sqlSelectNr, [userID], (err, result) => {
    let orgNum = result[0].organization_nr;
    const sqlSelect =
      "select offender_name, (case when offence_list.offence_name='other' then other.offence_name else offence_list.offence_name end) as offence_name,logged_offences.ticket_id,crs_code, offence_status from logged_offences left join offence_list on logged_offences.offence_id= offence_list.offence_id left join other on logged_offences.ticket_id=other.ticket_id where offender_name=?";
    db.query(sqlSelect, [orgNum], (err, result) => {
      res.send(result);
    });
  });
});

//creating a signed pledge, must have pdf that will be downloaded and signed later
app.post(
  "/createSignedPledge",
  uploadSignedPledge.single("file"),
  (req, res) => {
    //let fileType=req.file.mimetype.split("/")[1];
    let newFileName = Date.now() + req.file.originalname; //new name with date to ensure uniqueness and prevernt overwrite
    let oldPath = "./Uploads/Pledges/SignedPledges/" + req.file.filename; //where file has just been uploaded
    let newPath = "./Uploads/Pledges/SignedPledges/" + newFileName;
    let saveLink = "/Uploads/Pledges/SignedPledges/" + newFileName; //link to be saved in database to find pledge pdf with
    fs.rename(oldPath, newPath, function (err) {
      console.log(err);
      //res.send("200");
    });
    const name = req.body.name;
    const desc = req.body.desc;
    const sessions = req.body.sessions;
    const type = "Signed Pledge";
    const sqlInsert =
      "INSERT INTO pledges (pledge_name, pledge_desc, pledge_type, pledge_link) VALUES (?,?,?,?);"; // insert into pledges table
    db.query(sqlInsert, [name, desc, type, saveLink], (err, res) => {
      if (err != null) {
        console.log(err);
      } else {
        const sqlSelectPledge =
          "SELECT pledge_id FROM pledges ORDER BY pledge_id DESC LIMIT 1";
        db.query(sqlSelectPledge, (err, result) => {
          if (err != null) {
            console.log(err);
          } else {
            let pledge_id = result[0].pledge_id;
            const sqlInsertSesLink =
              "Insert into session_link (session_id, pledge_id) values (?,?)";
            for (let j = 0; j < sessions.length; j++) {
              db.query(
                sqlInsertSesLink,
                [sessions[j], pledge_id],
                (err, result) => {
                  if (err != null) {
                    console.log(err);
                  }
                }
              );
            }
          }
        });
      }
    });
  }
);

//creating a clicked pledge, has no file upload
app.post("/createClickedPledge", function (req, res) {
  const name = req.body.name;
  const desc = req.body.desc;
  const pledge_type = "Clicked Pledge";
  const sqlInsert =
    "INSERT INTO pledges (pledge_name, pledge_desc, pledge_type) VALUES (?,?,?);";
  db.query(sqlInsert, [name, desc, pledge_type], (error, result) => {
    if (error != null) {
      console.log(error);
    } else {
      const sqlSelectPledge =
        "SELECT pledge_id FROM pledges ORDER BY pledge_id DESC LIMIT 1";
      db.query(sqlSelectPledge, (err, result) => {
        if (err != null) {
          console.log(err);
        } else {
          let pledge_id = result[0].pledge_id;
          const sqlInsertSesLink =
            "Insert into session_link (session_id, pledge_id) values (?,?)";
          for (let j = 0; j < sessions.length; j++) {
            db.query(
              sqlInsertSesLink,
              [sessions[j], pledge_id],
              (err, result) => {
                if (err != null) {
                  console.log(err);
                }
              }
            );
          }
        }
      });
    }
  });
});

//schedule a new hearing, !!!!!consider inserting into investigation_record tabel
app.post("/insertOI", (req, res) => {
  const studNo = req.body.studNo;
  const meetDate = req.body.meetDate;
  const meetLink = req.body.meetLink;
  const ticket_id = req.body.ticket_id;
  const sqlInsertMeeting =
    "Insert into meetings (studNo, meetDate, meetLink,ticket_id) values(?,?,?,?)";
  const sqlSelect = "Select user_id from users where organization_nr=?";
  const sqlInsertAction =
    "Insert into actions (student_id, tables, table_id, seen, date, action_desc) values (?, ?, ?, ?, ?, ?)"; //used to send alert to student
  db.query(
    sqlInsertMeeting,
    [studNo, meetDate, meetLink, ticket_id],
    (err, result) => {
      if (err != null) {
        console.log(err);
      } else {
        let student_id;
        db.query(sqlSelect, [studNo], (err, result) => {
          if (err != null) {
            console.log(err);
          } else {
            console.log(result);
            student_id = result[0].user_id;
            let table = "meeting";
            let tableID = ticket_id;
            let seen = "false";
            let date = new Date().toISOString().slice(0, 10);
            let actionDesc = "Hearing has been scheduled"; //message of alert sent to student
            db.query(
              sqlInsertAction,
              [student_id, table, tableID, seen, date, actionDesc],
              (err, result) => {
                if (err != null) {
                  console.log(err);
                } else {
                  res.send("successful");
                }
              }
            );
          }
        });
      }
    }
  );
});

//update status of logged offence !!!(for now can be pending, guilty, not guilty...look at investigation_record later)
app.post("/updateOI", (req, res) => {
  const ticket_id = req.body.ticket_id;
  const offence_status = req.body.offence_status;
  const sqlSelect =
    "UPDATE logged_offences SET offence_status = ? WHERE ticket_id = ?";
  db.query(sqlSelect, [offence_status, ticket_id], (err, result) => {
    if (err != null) {
      console.log(err);
    } else {
      let student_id;
      const sqlGetStudent =
        "select user_id from users left join logged_offences on offender_name=organization_nr where ticket_id=?;";
      db.query(sqlGetStudent, [ticket_id], (err, result) => {
        if (err != null) {
          console.log(err);
        } else {
          console.log(result);
          student_id = result[0].user_id;
          let table = "logged_offences";
          let tableID = ticket_id;
          let seen = "false";
          let date = new Date().toISOString().slice(0, 10);
          let actionDesc = "Your offence ticket has been updated";
          const sqlInsertAction =
            "Insert into actions (student_id, tables, table_id, seen, date, action_desc) values (?, ?, ?, ?, ?, ?)"; //notification to student that a ticket has been updated
          db.query(
            sqlInsertAction,
            [student_id, table, tableID, seen, date, actionDesc],
            (err, result) => {
              if (err != null) {
                console.log(err);
              } else {
                res.send("successful");
              }
            }
          );
        }
      });
    }
  });
});

//automated email sent to SRC to inform them that a student needs help !!still need to add SRC email
app.post("/sendhelp", (req, res) => {
  const stdNo = req.body.stdNo;
  const sqlSelect = "select email from users where organization_nr=?"; //get student email from database
  db.query(sqlSelect, [stdNo], (err, result) => {
    const stdEmail = result[0].email;
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sdteamoops@gmail.com",
        pass: "SD1Team1OOPS!",
      },
      tls: {
        rejectUnauthorised: false,
      },
    });

    offenderEmail = stdEmail;
    let mailOptions = {
      from: "sdteamoops@gmail.com",
      to: offenderEmail,
      subject: "Help Report",
      text: "This is an auto generated email.\nYour Help request has been sent and will be attended to shortly. \n Thank you",
    };
    transporter.sendMail(mailOptions, function (err, success) {
      if (err) {
        console.log(err);
        res.send("Unable to send email to offender");
      } else {
        console.log("Email sent to " + offenderEmail);
      }
    });

    ///still add SRC email here!!!!
  });

  res.send("Successful"); //still put this in appropriate place...try catch with both emails maybe?
});

//send email to student that a new meeting hass been scheduled for their ticket
app.post("/sendMeetEmail", (req, res) => {
  const date = req.body.meetDate;
  const link = req.body.meetLink;
  const stdNo = req.body.stdNo;
  const sqlSelect = "select email from users where organization_nr=?"; //get student email from database
  db.query(sqlSelect, [stdNo], (err, result) => {
    const stdEmail = result[0].email;
    let smtpTransport = nodemailer.createTransport({
      service: "Gmail",
      port: 465,
      auth: {
        user: "sdteamoops@gmail.com",
        pass: "SD1Team1OOPS!",
      },
    });

    //send email to alert student that a hearing has been scheduled
    let mailOptionss = {
      from: "<sdteamoops@gmail.com",
      to: stdEmail,
      subject: "Hearing - scheduled date",
      text:
        "This is an auto generated email , please dont reply to this email.\n \n You have a hearing on the " +
        date +
        " \n \n Link for meeeting: " +
        link,
    };

    smtpTransport.sendMail(mailOptionss, (error, response) => {
      if (error) {
        res.send(error);
        console.log(error);
      } else {
        res.send("Success");
        console.log("success");
      }
    });
    smtpTransport.close();
  });
});

//uploading new evidence
app.post("/UploadEvidence", uploadEvidenceDoc.single("file"), (req, res) => {
  //let fileType=req.file.mimetype.split("/")[1];
  const ticketID = req.body.ticket_id;
  let newFileName = Date.now() + req.file.originalname;
  let oldPath = "./Uploads/Evidence/" + req.file.filename; //file just uploaded
  let newPath = "./Uploads/Evidence/ticket" + ticketID + "/" + newFileName; //move to appropriate diectory named for ticket id
  fs.rename(oldPath, newPath, function (err) {
    console.log(err);
    res.send("successful");
  });
});

//send email to student that their ticket has been updated
app.post("/sendUpdateEmail", (req, res) => {
  const ticketId = req.body.ticket_id;
  const status = req.body.status;
  const stdNo = req.body.stdNo;
  const sqlSelect = "select email from users where organization_nr=?"; //get email from database
  db.query(sqlSelect, [stdNo], (err, result) => {
    const stdEmail = result[0].email;
    let smtpTransport = nodemailer.createTransport({
      service: "Gmail",
      port: 465,
      auth: {
        user: "sdteamoops@gmail.com",
        pass: "SD1Team1OOPS!",
      },
    });

    //send email to alert student that their ticket has been updated
    let mailOptionss = {
      from: "<sdteamoops@gmail.com",
      to: stdEmail,
      subject: "Offence Status Update",
      text:
        "This is an auto generated email , please dont reply to this email.\n \n Ticket " +
        ticketId +
        " has been updated to: " +
        status,
    };

    smtpTransport.sendMail(mailOptionss, (error, response) => {
      if (error) {
        res.send(error);
        console.log(error);
      } else {
        res.send("Success");
        console.log("success");
      }
    });
    smtpTransport.close();
  });
});

///create a test and add a pledge...!!!!!extend to sessions
app.post("/createTest", (req, res) => {
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
  const sqlInsert =
    "INSERT INTO tests (test_name, test_date, course_code, creator_id, test_link, pledge_id) VALUES (?,?,?,?,?,?);"; // insert into test table
  db.query(
    sqlInsert,
    [testName, testDate, courseCode, creatorID, dir, pledgeID],
    (err, res) => {
      if (err != null) {
        console.log(err);
      }
    }
  );
});

//get pledge associated with session
app.get("/sessionPledgeLink", function (req, res) {
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
app.post("/submitSession", uploadStudentPledge.single("file"), (req, res) => {
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

    const sqlSelectURL =
      "select session_folder from sessions where session_id=?"; //extend to sessions
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

      const sqlInsert =
        "INSERT INTO completed_sessions (student_id, session_id,pledge_id, pledge_link, paragraph) VALUES (?,?,?,?,?);"; // insert into submisisons table
      db.query(
        sqlInsert,
        [studentID, sessionID, pledgeID, saveLink, paragraph],
        (err, res) => {
          if (err != null) {
            console.log(err);
          }
        }
      );
    });
  });
});

//give admin a report of students that completed test...extend to sessions
app.get("/testReport", (req, res) => {
  ///this is to display which students have completed the pledge
  const id = req.query["testID"];
  const sqlSelect =
    "select organization_nr, name, surname, paragraph from pledge_submissions left join users on user_id = student_id where test_id=?";
  db.query(sqlSelect, [id], (error, result) => {
    res.send(result);
  });
});

//get pledge description to be added in table...see if same as view pledges
app.get("/pledgeType", function (req, res) {
  const testID = req.query["testID"];
  sqlSelect =
    "SELECT pledge_type, pledge_desc FROM tests left join pledges on tests.pledge_id=pledges.pledge_id where test_id=?;";
  db.query(sqlSelect, [testID], (error, result) => {
    res.send(result[0]);
  });
});

//get the notifications that should be displayed for a student
app.get("/myActions", (req, res) => {
  const studentNr = req.query["studentID"];
  console.log(studentNr);
  const sqlSelect =
    'select * from actions where student_id=? and seen="false";';
  db.query(sqlSelect, [studentNr], (err, result) => {
    if (err != null) {
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
    }
  });
});

//adding a session
app.post("/insertses", (req, res) => {

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
          })


        })
      })
    }
  });
});


//view all the sessions...if admin..show only created by certain admin? why would they change others' stuff?
app.get("/sessions", (req, res) => {
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
app.get("/getSession", (req, res) => {
  const session_id = req.query["session_id"];
  const sqlSelect = "select * from sessions where session_id=?";
  db.query(sqlSelect, [session_id], (err, result) => {
    if (err != null) {
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
    }
  });
});

//updating session
app.post("/updateses", (req, res) => {
  const session_id = req.body.session_id;
  const date = req.body.date;
  const time = req.body.time;
  const session_name = req.body.session_name;
  //console.log(req.body);
  const sqlSelect =
    "UPDATE sessions SET date = ?, time =?, session_name=? WHERE session_id = ?";
  db.query(sqlSelect, [date, time, session_name, session_id], (err, result) => {
    console.log(err);
    res.send("update");
  });
});

//see all sessions associated with that student
app.get('/mySessions', (req, res) => {
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

//set notification to seen so that it doesn't appear in notification centre anymore
app.post('/viewAction', (req, res) => {
  const actionId = req.body.actionID;
  const sqlUpdate = "Update actions set seen='true' where action_id=?";
  db.query(sqlUpdate, [actionId], (err, result) => {
    if (err != null) {
      console.log(err)
    }
    res.send(result);
  })
});

//get all the meetings to display them in calendar
app.get("/getAllMeetings", (req, res) => {
  const sqlQuerry = "Select meetLink, meetDate from meetings;";
  db.query(sqlQuerry, (error, result) => {
    res.send(result);
    // console.log(result);
  });
});

app.get("/getAllSessions", (req, res) => {
  const sqlQuerry = "Select session_type, date,session_id  from sessions;";
  db.query(sqlQuerry, (error, result) => {
    res.send(result);
    // console.log(result);
  });
});

//adding a checklist
app.get("/addCheckList", (req, res) => {
  const sqlGetId =
    "SELECT check_id FROM checklist ORDER BY check_id DESC LIMIT 1"; //get last  created checklist id
  db.query(sqlGetId, (err, result) => {
    res.send(result[0]);
    // console.log(result[0])
  });
});

//adding a question
app.post("/addCheckListQuestion", (req, res) => {
  const session_id = req.body.session_id;
  const checklist_id = req.body.checklist_id;
  const question_details = req.body.question_details;

  const sqlGetId =
    "SELECT question_number FROM checklist WHERE check_id = ? AND session_id = ? ORDER BY question_number DESC LIMIT 1"; //get last  created checklist id
  db.query(sqlGetId, [checklist_id, session_id], (err, result) => {
    console.log(result);
    let question_num;
    if (result.length == 0) {
      question_num = 1;
    } else {
      question_num = result[0].question_number + 1;
    }

    const sqlInsert =
      "Insert into checklist (check_id, question_number, question_details, session_id) values (?, ?, ?, ?)";
    db.query(
      sqlInsert,
      [checklist_id, question_num, question_details, session_id],
      (err, result) => {
        if (err != null) {
          console.log(err);
        }
      }
    );
  });
});

app.post("/allCheckListQuestions", (req, res) => {
  const session_id = req.body.session_id;
  const checklist_id = req.body.checklist_id;
  const sqlGetId =
    "SELECT * FROM checklist WHERE session_id = ? AND check_id = ?";
  db.query(sqlGetId, [session_id, checklist_id], (err, result) => {
    res.send(result);
  });
});

app.get("/CheckLists", (req, res) => {
  const sqlSelect =
    "select check_id, question_number, question_details,session_id from checkList";
  db.query(sqlSelect, (error, result) => {
    res.send(result);
  });
});


app.post("/viewCheck_id", (req, res) => {
  const session_id = req.body.session_id;
  // const checklist_id = req.body.checklist_id;
  // console.log(session_id)
  const sqlSelect =
    "select distinct check_id from checklist WHERE session_id = ?";
  db.query(sqlSelect, [session_id], (error, result) => {
    res.send(result);
  });
});

app.post("/updateCheckListQuestion", (req, res) => {
  const question_num = req.body.question_num;
  const session_id = req.body.session_id;
  const checklist_id = req.body.checklist_id;
  const question_details = req.body.question_details;
  console.log(question_details);
  const sqlUpdate =
    "Update checklist set question_details = ? where check_id = ? AND question_number= ? AND session_id = ?";
  db.query(
    sqlUpdate,
    [question_details, checklist_id, question_num, session_id],
    (err, result) => {
      if (err != null) {
        console.log(err);
      }
    }
  );
});

app.post("/deleteCheckListQuestion", (req, res) => {
  const question_num = req.body.question_num;
  const session_id = req.body.session_id;
  const checklist_id = req.body.checklist_id;
  const sqlSelect =
    "Delete from checklist where check_id = ? AND question_number= ? AND session_id = ?";
  db.query(
    sqlSelect,
    [checklist_id, question_num, session_id],
    (err, result) => {
      if (err == null) {
        console.log("deleted");
        res.send("deleted");
      }
    }
  );
});

//get all the pledges associated with a session
app.get("/sessionPledges", (req, res) => {
  const session_id = req.query["select_id"];
  const sqlSelect =
    "select * from session_link left join pledges on session_link.pledge_id=pledges.pledge_id left join sessions on session_link.session_id =sessions.session_id where sessions.session_id=?";
  db.query(sqlSelect, [session_id], (err, result) => {
    if (err != null) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/getChecklistAns", (req, res) => {
  const sqlQuerry =
    "select filledchecklist.checklist_id, filledchecklist.stu_id, filledchecklist.question_number, filledchecklist.checked, checklist.session_id from filledchecklist, checklist where filledchecklist.checklist_id = checklist.check_id and checklist.question_number = filledchecklist.question_number order by session_id, stu_id;";

  db.query(sqlQuerry, (error, result) => {
    res.send(result);
  });
});

//get pledge associated with session
app.get('/sessionPledgeLink', function (req, res) {
  //var filePath = "/Uploads/Pledges/SignedPledges/1650355918774Plagiarism Pledge.pdf"; //this will be what gets saved in database
  const id = req.query['pledge_id']; //gets id from frontend
  //var filePath1;
  const sqlSelect = "SELECT pledge_link from pledges where pledge_id= ?";//get link where pledge is stored
  db.query(sqlSelect, [id], (error, result) => {
    //res.send(result);
    //console.log(result[0].pledge_link)
    const filePath = result[0].pledge_link;
    if (error != null) {
      console.log(error)
    }

    fs.readFile(__dirname + filePath, function (err, data) {
      res.contentType("application/pdf");
      res.send(data);
      //console.log(__dirname);
    });
  });


});
///student ability to complete sessions
app.post("/submitSession", uploadStudentPledge.single("file"), (req, res) => { //uploading the pledge that student signed before test
  //get student nr from database and then do upload!!!!
  const studentID = req.body.studentID;
  const paragraph = req.body.paragraph;
  const sessionID = req.body.sessionID;
  const pledgeID = req.body.pledgeID

  const sqlSelect = "select organization_nr from users where user_id =?"; //student nr
  db.query(sqlSelect, [studentID], (error, result) => {
    console.log(studentID);
    const studentNr = result[0].organization_nr;

    const sqlSelectURL = "select session_folder from sessions where session_id=?"; //extend to sessions
    db.query(sqlSelectURL, [sessionID], (error, result) => {
      const sessionLink = result[0].session_folder;
      let newFileName = studentNr + ".pdf";
      let oldPath = "./Uploads/SubmittedSessions/" + req.file.filename;
      console.log(sessionLink);
      let newPath = sessionLink + "/" + newFileName;
      let saveLink = newPath.slice(1);
      fs.rename(oldPath, newPath, function (err) {
        console.log(err);
        res.send("200");
      });

      const sqlInsert = "INSERT INTO completed_sessions (student_id, session_id,pledge_id, pledge_link, paragraph) VALUES (?,?,?,?,?);";   // insert into submisisons table
      db.query(sqlInsert, [studentID, sessionID, pledgeID, saveLink, paragraph], (err, res) => {
        if (err != null) {
          console.log(err)
        }
      });

    });


  });



});
app.listen(3001, () => {
  console.log("running on port 3001");
});
