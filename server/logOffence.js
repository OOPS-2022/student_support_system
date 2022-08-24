const express = require("express");
const router=express.Router();
const db = require("./database");
const multer = require("multer");
const uploadEvidenceDoc = multer({ dest: "./Uploads/Evidence" });
const fs = require("fs");
const nodemailer = require("nodemailer");

//log an offence when evidence hasn't been submitted (evidence optional)
router.post("/LogOffenceNoFile", (req, res) => {
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
  const sqlSelect = "SELECT offence_id FROM offence_list WHERE offence_name = ?";  // get offence_id from table
  db.query(sqlSelect, [offenceType], (err, result) => {
      if (result[0] != null) {
          offenceID = result[0].offence_id;
          const sqlInsert = "INSERT INTO logged_offences ( offender_name, offence_id, details, crs_code, offence_status, submitter_id ) VALUES (?,?,?,?,?,?);";   // insert into log table
          db.query(sqlInsert, [offenderName, offenceID, offenceDetails, offenceCode, offenceStatus, submittedBy], (err, result) => {
              const sqlGetId = "SELECT * FROM logged_offences ORDER BY ticket_id DESC LIMIT 1";  // get ticket_id the ticket we just created
              db.query(sqlGetId, (err, result) => {
                  ticket_id = result[0].ticket_id;
                  const sqlInsert = "INSERT INTO other (ticket_id, offence_name) VALUES (?,?);";   // insert into log table
                  if (offenceType === "other") {
                      db.query(sqlInsert, [ticket_id, offenceOther], (err, result) => {
                          if (err !== null) { //if there is an error inserting into other, delete the offence from logged_offences
                              const sqlDelete = "DELETE FROM logged_offences ORDER BY ticket_id DESC LIMIT 1";
                              db.query(sqlDelete, (err, result));
                              //res.send("Failed");
                              //return;
                          }
                      });

                  }
                  //create directory to store all evidence related to this ticket
                  const dir = './Uploads/Evidence/ticket' + ticket_id;
                  const saveLink = '/Uploads/Evidence/ticket' + ticket_id;
                  fs.mkdir(dir, err => {
                      if (err) {
                          throw err;
                      }
                  })
                  //now insert this directory into database
                  const sqlUpdateLink = 'Update logged_offences set ticket_link=? where ticket_id=?';
                  db.query(sqlUpdateLink, [saveLink, ticket_id], (err, result) => {
                      if (err != null) {
                          console.log(err)
                      }
                  })

                  const sqlGetStudent = "select user_id from users where organization_nr=?"; //get student user id from database
                  const sqlInsertAction = "Insert into actions (student_id, tables, table_id, seen, date, action_desc) values (?, ?, ?, ?, ?, ?)"; //this will allow the student to get an alert
                  db.query(sqlGetStudent, [offenderName], (err, result) => {
                      let student_id = result[0].user_id;
                      let table = "logged_offence"; //this will later allow us to redirect the notifiaction to appropriate page
                      let tableID = ticket_id;
                      let seen = "false";
                      let date = new Date().toISOString().slice(0, 10);
                      let actionDesc = "An offence has been logged against you.";
                      db.query(sqlInsertAction, [student_id, table, tableID, seen, date, actionDesc], (err, result) => {
                          if (err != null) {
                              console.log(err)
                          }
                      })

                  })
              })


          });
      }
  });



  //set up our email.
  let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
          user: "sdteamoops@gmail.com",
          pass: "SD1Team1OOPS!"
      },
      tls: {
          rejectUnauthorised: false,
      }
  })

  const sqlSelectEmail = 'select email from users where organization_nr=?'; //get student email from database
  db.query(sqlSelectEmail, [offenderName], (err, result) => {
      offenderEmail = result[0].email;
      let mailOptions = {
          from: "sdteamoops@gmail.com",
          to: offenderEmail,
          subject: "Logged Offence",
          text: "This is an auto generated email.\nA student has reported an offence against you under the category of " + offenceType + ", an investigation into this case will follow."
      }
      //send email to student to alert them that an offence has been logged against them
      transporter.sendMail(mailOptions, function (err, success) {
          if (err) {
              console.log(err);
              res.send("Unable to send email to offender");
          } else {
              console.log("Email sent to " + offenderEmail)
              res.send("Successful");
          }
      })
  })
});

//log an offence when a pdf file has been submitted as evidence
router.post("/LogOffence", uploadEvidenceDoc.single('file'), (req, res) => {
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
  const sqlSelect = "SELECT offence_id FROM offence_list WHERE offence_name = ?";  // get offence_id from table
  db.query(sqlSelect, [offenceType], (err, result) => {
      if (result[0] != null) {
          offenceID = result[0].offence_id;
          const sqlInsert = "INSERT INTO logged_offences ( offender_name, offence_id, details, crs_code, offence_status, submitter_id ) VALUES (?,?,?,?,?,?);";   // insert into log table
          db.query(sqlInsert, [offenderName, offenceID, offenceDetails, offenceCode, offenceStatus, submittedBy], (err, result) => {
              if (err != null) {
                 console.log(err)
                 
              } else {
                  //create directory named for the ticket id
                  const sqlGetId = "SELECT ticket_id FROM logged_offences ORDER BY ticket_id DESC LIMIT 1";//get ticket
                  db.query(sqlGetId, (err, result) => {
                      ticket_id = result[0].ticket_id;
                      const dir = './Uploads/Evidence/ticket' + ticket_id;
                      const saveLink = '/Uploads/Evidence/ticket' + ticket_id;
                      fs.mkdir(dir, err => {
                          if (err) {
                              throw err;
                          }
                      })
                      //now insert this directory into database
                      const sqlUpdateLink = 'Update logged_offences set ticket_link=? where ticket_id=?';
                      db.query(sqlUpdateLink, [saveLink, ticket_id], (err, result) => {
                          if (err != null) {
                              console.log(err)
                          }
                      })
                      //let fileType=req.file.mimetype.split("/")[1];

                      //get the file sent through and save it in the directory just created
                      let newFileName = Date.now() + req.file.originalname; //adding date ensures unique file name and lessens possibility of file loss and overwrites
                      let oldPath = "./Uploads/Evidence/" + req.file.filename; //file path where it has been uploaded
                      let newPath = "./Uploads/Evidence/ticket" + ticket_id + '/' + newFileName //created directory that we want to move the file to
                      fs.rename(oldPath, newPath, function (err) {
                          console.log(err);
                      });

                      const sqlInsert = "INSERT INTO other (ticket_id, offence_name) VALUES (?,?);";   // insert into log table
                      if (offenceType === "other") {
                          db.query(sqlInsert, [ticket_id, offenceOther], (err, result) => {
                              if (err !== null) { //if failed to insert into other, delete from logged offence
                                  const sqlDelete = "DELETE FROM logged_offences ORDER BY ticket_id DESC LIMIT 1";
                                  db.query(sqlDelete, (err, result));
                                  console.log(err);
                                  //return;
                              }
                          });

                      }
                      const sqlGetStudent = "select user_id from users where organization_nr=?"; //get student user id from database
                      const sqlInsertAction = "Insert into actions (student_id, tables, table_id, seen, date, action_desc) values (?, ?, ?, ?, ?, ?)"; //send action to student to get notification
                      db.query(sqlGetStudent, [offenderName], (err, result) => {
                          let student_id = result[0].user_id;
                          let table = "logged_offence";
                          let tableID = ticket_id;
                          let seen = "false";
                          let date = new Date().toISOString().slice(0, 10);
                          let actionDesc = "An offence has been logged against you.";
                          db.query(sqlInsertAction, [student_id, table, tableID, seen, date, actionDesc], (err, result) => {
                              if (err != null) {
                                  console.log(err)
                              }
                          })

                      })
                  })
              }
          });
      }
  });

  let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
          user: "sdteamoops@gmail.com",
          pass: "SD1Team1OOPS!"
      },
      tls: {
          rejectUnauthorised: false,
      }
  })

  const sqlSelectEmail = 'select email from users where organization_nr=?';
  db.query(sqlSelectEmail, [offenderName], (err, result) => {
      offenderEmail = result[0].email;
      let mailOptions = {
          from: "sdteamoops@gmail.com",
          to: offenderEmail,
          subject: "Logged Offence",
          text: "This is an auto generated email.\nA student has reported an offence against you under the category of " + offenceType + ", an investigation into this case will follow."
      }
      transporter.sendMail(mailOptions, function (err, success) { //send email to alert student that an offence has been logged against them
          if (err) {
              console.log(err);
              res.send("Unable to send email to offender");
          } else {
              console.log("Email sent to " + offenderEmail)
              res.send("Successful");
          }
      })
  })
});

module.exports=router;

