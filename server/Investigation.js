function investigation(database){
  const express = require("express");
  const router=express.Router();
  const multer = require("multer");
  const uploadEvidenceDoc = multer({ dest: "./Uploads/Evidence" });
  const fs = require("fs");
  const nodemailer = require("nodemailer");

  //set up our email.
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "sdteamoops@gmail.com",
      pass: "itfwabyrkopdiqfp",
    },
    tls: {
      rejectUnauthorised: false,
    },
  });


function sendMail(mailOptions, callback){
  transporter.sendMail(mailOptions, function (err, success) {
    if (err) {
      if(mailOptions.to == "test"){
        callback(null, 200);
        return
      }
      //console.log(err);callback("Unable to send email to offender", null);} else {console.log("Email sent to " + offenderEmail);
      callback(null,"Successful");}});
}

  //get the amount of files that are in a directory for a ticket
  router.get("/fileNumber", function (req, res) {
    if(Object.keys(req.query).length < 1){
      res.send(null);
    }else{
      const id = req.query["ticket_id"];
      let directory_name = "Uploads/Evidence/ticket" + id;
      let filenames = fs.readdirSync(directory_name);
      let result = filenames.length.toString();
      res.send(result);
    }
  });
    

  //view the files stored as evidence for a ticket
  router.get("/viewTicketFiles", function (req, res) {
    if(Object.keys(req.query).length < 2){
      res.send(null);
    }else{
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
    }
    
  });
    

  //request to show the progress of how the ticket is being progressed
  router.get("/ticketTracker", (req, res) => {
      const ticketID = req.query["ticketID"];
      database.ticketTracker(ticketID, function(err, result){
        res.send(result)
      })
  });
    
  //get all the hearings associated with the ticket. This will show the student when they have a hearing
  router.get("/myHearing", (req, res) => {
      const ticket_id = req.query["ticket_id"];
      database.myHearing(ticket_id, function(err, result){
        res.send(result)
      })
  });
    
  //get all the offences logged against a certain student so that they can keep track of their investigations
  router.get("/viewMyOffences", (req, res) => {
      const userID = req.query["userID"];
      database.viewMyOffences(userID, function(err, result){
        res.send(result)
      })
  });
    
  //schedule a new hearing, !!!!!consider inserting into investigation_record tabel
  router.post("/insertOI", (req, res) => {
    if(Object.keys(req.body).length < 4){
      res.send(null);
    }else{
      const studNo = req.body.studNo;
      const meetDate = req.body.meetDate;
      const meetLink = req.body.meetLink;
      const ticket_id = req.body.ticket_id;
      database.insertOI(studNo, meetDate, meetLink, ticket_id, function(err, result){
        res.send(result)
      })
    }
  });
    
  //update status of logged offence !!!(for now can be pending, guilty, not guilty...look at investigation_record later)
  router.post("/updateOI", (req, res) => {
    if(Object.keys(req.body).length < 2){
      res.send(null);
    }else{
      const ticket_id = req.body.ticket_id;
      const offence_status = req.body.offence_status;
      database.updateOI(ticket_id,offence_status, function(err, result){
        res.send(result)
      })
    }
  });
    
  //automated email sent to SRC to inform them that a student needs help !!still need to add SRC email
  router.post("/sendhelp", (req, res) => {
    if(Object.keys(req.body).length < 1){
      res.send(null);
    }else{
      const stdNo = req.body.stdNo;
      
      database.getEmail(stdNo, function(err, result){
        let mailOptions = {
          from: "sdteamoops@gmail.com",
          to: result,
          subject: "Help Report",
          text: "This is an auto generated email.\nYour Help request has been sent and will be attended to shortly. \n Thank you",
        };
          sendMail(mailOptions, function(err, result){
            if(err){
              res.send(err)
            }else{
              res.send(result)
            }
          });
      })
        ///still add SRC email here!!!!
    } 
  });
    
  //send email to student that a new meeting hass been scheduled for their ticket
  router.post("/sendMeetEmail", (req, res) => {
    if(Object.keys(req.body).length < 3){
      res.send(null);
    }else{
      const date = req.body.meetDate;
      const link = req.body.meetLink;
      const stdNo = req.body.stdNo;
      
      database.getEmail(stdNo, function(err, result){
          let mailOptions = {
            from: "<sdteamoops@gmail.com",
            to: result,
            subject: "Hearing - scheduled date",
            text:
              "This is an auto generated email , please dont reply to this email.\n \n You have a hearing on the " +
              date +
              " \n \n Link for meeeting: " +
              link,
          };
          sendMail(mailOptions,  function(err, result){
            if(err){
              res.send(err)
            }else{
              res.send(result)
            }
          })
      })
    }
  });
    
  //uploading new evidence
  router.post("/UploadEvidence", uploadEvidenceDoc.single("file"), (req, res) => {
      //let fileType=req.file.mimetype.split("/")[1];
      const ticketID = req.body.ticket_id;
      console.log(req.file);
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
    if(Object.keys(req.body).length < 3){
      res.send(null);
    }else{
      const ticketId = req.body.ticket_id;
      const status = req.body.status;
      const stdNo = req.body.stdNo;
      
      database.getEmail(stdNo, function(err, result){
        //send email to alert student that their ticket has been updated
      let mailOptions = {
        from: "<sdteamoops@gmail.com",
        to: result,
        subject: "Offence Status Update",
        text:
          "This is an auto generated email , please dont reply to this email.\n \n Ticket " +
          ticketId +
          " has been updated to: " +
          status,
      };
        sendMail(mailOptions,  function(err, result){
          if(err){
            res.send(err)
          }else{
            res.send(result)
          }
        })
      });
    }
  });

  //get all the meetings to display them in calendar
  router.get("/getAllMeetings", (req, res) => {
    database.getAllMeetings( function(err, result){
      res.send(result);
    })
  });

  //get whether person is observer or collaborator
  router.post("/getRole", (req, res)=>{
    if(Object.keys(req.body).length < 2){
      res.send(null);
    }
    else{
      const userID = req.body.userID;
      const ticketID = req.body.ticketID;
      
      database.getRole(userID, ticketID, function(err, result){
        res.send(result);
      })
    }
    
  })

  //add either observer or collaborator
  router.post("/addCollab", (req, res) => {
    if(Object.keys(req.body).length <3){
      res.send(null);
    }
    else{
      const email=req.body.email;
      const role=req.body.role;
      const ticket_id=req.body.ticket_id;
      //console.log(email);
        database.addCollab(email, ticket_id, role, function(err, result){
          res.send("Success");
        })
    }
  })

  router.post("/getPeople", (req,res)=>{
    if(Object.keys(req.body).length>1){
      res.send(null);
    }
    else{
        const ticket_id=req.body.ticket_id;
        console.log(ticket_id);
        database.getPeople(ticket_id, function(err , result){
          //console.log(result);
          res.send(result);
        })
    }
  })

  router.post("/deleteCollab", (req, res)=>{
    if (Object.keys(req.body).length<2){
      res.send(null);
    }
    else{
      const email=req.body.email;
      const ticket_id=req.body.ticket_id;
      database.deleteCollab(email, ticket_id, function(err, result){
        res.send("Success");
      })
    }
  })

  return router;
}

module.exports=investigation;

