const express = require("express");
const router=express.Router();
const db = require("./database");

const multer = require("multer");
const uploadEvidenceDoc = multer({ dest: "./Uploads/Evidence" });
const fs = require("fs");
const nodemailer = require("nodemailer");

 //set up our email.
 const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "sdteamoops@gmail.com",
      pass: "SD1Team1OOPS!",
    },
    tls: {
      rejectUnauthorised: false,
    },
});

//get the amount of files that are in a directory for a ticket
router.get("/fileNumber", function (req, res) {
    const id = req.query["ticket_id"];
    let directory_name = "Uploads/Evidence/ticket" + id;
    let filenames = fs.readdirSync(directory_name);
    let result = filenames.length.toString();
    res.send(result);
});
  
//view the files stored as evidence for a ticket
router.get("/viewTicketFiles", function (req, res) {
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
  
});
  
//request to show the progress of how the ticket is being progressed
router.get("/ticketTracker", (req, res) => {
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
router.get("/myHearing", (req, res) => {
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
router.get("/viewMyOffences", (req, res) => {
    const userID = req.query["userID"];
    const sqlSelectNr = "select organization_nr from users where user_id=?";
    db.query(sqlSelectNr, [userID], (err, result) => {
      let orgNum = result[0].organization_nr;
      const sqlSelect ="select offender_name, (case when offence_list.offence_name='other' then other.offence_name else offence_list.offence_name end) as offence_name,logged_offences.ticket_id,crs_code, offence_status from logged_offences left join offence_list on logged_offences.offence_id= offence_list.offence_id left join other on logged_offences.ticket_id=other.ticket_id where offender_name=?";
      db.query(sqlSelect, [orgNum], (err, result) => {
        res.send(result);
      });
    });
});
  
//schedule a new hearing, !!!!!consider inserting into investigation_record tabel
router.post("/insertOI", (req, res) => {
    const studNo = req.body.studNo;
    const meetDate = req.body.meetDate;
    const meetLink = req.body.meetLink;
    const ticket_id = req.body.ticket_id;
    const sqlInsertMeeting ="Insert into meetings (studNo, meetDate, meetLink,ticket_id) values(?,?,?,?)";
    const sqlSelect = "Select user_id from users where organization_nr=?";
    const sqlInsertAction ="Insert into actions (student_id, tables, table_id, seen, date, action_desc) values (?, ?, ?, ?, ?, ?)"; //used to send alert to student
    db.query(sqlInsertMeeting, [studNo, meetDate, meetLink, ticket_id], (err, result) => {
        if (err != null) {
          console.log(err);
        } 
        else {
          let student_id;
          db.query(sqlSelect, [studNo], (err, result) => {
            if (err != null) {
              console.log(err);
            } 
            else {
              console.log(result);
              student_id = result[0].user_id;
              let table = "meeting";
              let tableID = ticket_id;
              let seen = "false";
              let date = new Date().toISOString().slice(0, 10);
              let actionDesc = "Hearing has been scheduled"; //message of alert sent to student
              db.query(sqlInsertAction, [student_id, table, tableID, seen, date, actionDesc], (err, result) => {
                  if (err != null) {
                    console.log(err);
                  } 
                  else {
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
router.post("/updateOI", (req, res) => {
    const ticket_id = req.body.ticket_id;
    const offence_status = req.body.offence_status;
    const sqlSelect ="UPDATE logged_offences SET offence_status = ? WHERE ticket_id = ?";
    db.query(sqlSelect, [offence_status, ticket_id], (err, result) => {
      if (err != null) {
        console.log(err);
      } 
      else {
        let student_id;
        const sqlGetStudent ="select user_id from users left join logged_offences on offender_name=organization_nr where ticket_id=?;";
        db.query(sqlGetStudent, [ticket_id], (err, result) => {
          if (err != null) {
            console.log(err);
          } 
          else {
            console.log(result);
            student_id = result[0].user_id;
            let table = "logged_offences";
            let tableID = ticket_id;
            let seen = "false";
            let date = new Date().toISOString().slice(0, 10);
            let actionDesc = "Your offence ticket has been updated";
            const sqlInsertAction ="Insert into actions (student_id, tables, table_id, seen, date, action_desc) values (?, ?, ?, ?, ?, ?)"; //notification to student that a ticket has been updated
            db.query(sqlInsertAction, [student_id, table, tableID, seen, date, actionDesc], (err, result) => {
                if (err != null) {
                  console.log(err);
                } 
                else {
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
router.post("/sendhelp", (req, res) => {
    const stdNo = req.body.stdNo;
    const sqlSelect = "select email from users where organization_nr=?"; //get student email from database
    db.query(sqlSelect, [stdNo], (err, result) => {
      const stdEmail = result[0].email;  
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
router.post("/sendMeetEmail", (req, res) => {
    const date = req.body.meetDate;
    const link = req.body.meetLink;
    const stdNo = req.body.stdNo;
    const sqlSelect = "select email from users where organization_nr=?"; //get student email from database
    db.query(sqlSelect, [stdNo], (err, result) => {
      const stdEmail = result[0].email;
        
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
  
      transporter.sendMail(mailOptionss, (error, response) => {
        if (error) {
          res.send(error);
          console.log(error);
        } 
        else {
          res.send("Success");
          console.log("success");
        }
      });
    });
});
  
//uploading new evidence
router.post("/UploadEvidence", uploadEvidenceDoc.single("file"), (req, res) => {
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
router.post("/sendUpdateEmail", (req, res) => {
    const ticketId = req.body.ticket_id;
    const status = req.body.status;
    const stdNo = req.body.stdNo;
    const sqlSelect = "select email from users where organization_nr=?"; //get email from database
    db.query(sqlSelect, [stdNo], (err, result) => {
      const stdEmail = result[0].email;
      
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
  
      transporter.sendMail(mailOptionss, (error, response) => {
        if (error) {
          res.send(error);
          console.log(error);
        } else {
          res.send("Success");
          console.log("success");
        }
      });
    });
});

//get all the meetings to display them in calendar
router.get("/getAllMeetings", (req, res) => {
    const sqlQuery = "Select meetLink, meetDate from meetings;";
    db.query(sqlQuery, (error, result) => {
      res.send(result);
      // console.log(result);
    });
});

module.exports=router;

