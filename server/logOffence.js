const { exit } = require("process");

function LogOffence(database){
  const express = require("express");
  const router=express.Router();
  // const db = require("./database");
  const multer = require("multer");
  const uploadEvidenceDoc = multer({ dest: "./Uploads/Evidence" });
  const fs = require("fs");

  //log an offence when evidence hasn't been submitted (evidence optional)
  router.post("/LogOffenceNoFile", (req, res) => {
      // post request to add a log
      if(Object.keys(req.body).length != 7){
        res.send(null);
      }else{
      const offenderName = req.body.offenderName;
      const offenceType = req.body.offenceType;
      const offenceDetails = req.body.offenceDetails;
      const offenceCode = req.body.offenceCode;
      const offenceOther = req.body.offenceOther;
      const submittedBy = req.body.submittedBy;
      const offenceStatus = req.body.offenceStatus;
      let offenceID;
      console.log(req.body);
      database.LogOffenceNoFile(offenderName, offenceID, offenceDetails, offenceCode, offenceStatus, submittedBy,offenceType,offenceOther,function(err, result){
        if ( result != null){
          const dir = "./Uploads/Evidence/ticket" + result;
          database.mkdir(dir, (err) => {
              database.fetchOffenderEmail(offenderName, function(err, result){
                if(database.sendMail(result, offenceType)){
                  res.send("Successful");
                }else{
                  res.send("Unable to send email to offender");
                }
              });
          });
        }
      });
    }
  });
    
  //log an offence when a pdf file has been submitted as evidence
  router.post("/LogOffence", uploadEvidenceDoc.single("file"), (req, res) => {
      // post request to add a log
      if(Object.keys(req.body).length != 7){
        res.send(null);
      }else{
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
        database.LogOffence(offenderName, offenceID, offenceDetails, offenceCode, offenceStatus, submittedBy,offenceType,offenceOther, function(err, result){
          if ( result != null){
            const dir = "./Uploads/Evidence/ticket" + result;
            database.mkdir(dir, (err) => {
              if (err) {
                throw err;
              }
            });

            database.rename(result,req.file, function (err) {
              console.log(err);
              // res.send("successful");
            });
            //get the file sent through and save it in the directory just created
            // let newFileName = Date.now() + req.file.originalname; //adding date ensures unique file name and lessens possibility of file loss and overwrites
            // let oldPath = "./Uploads/Evidence/" + req.file.filename; //file path where it has been uploaded
            // let newPath ="./Uploads/Evidence/ticket" + result + "/" + newFileName; //created directory that we want to move the file to
            // database.rename(oldPath, newPath, function (err) {
            //   console.log(err);
            // //   callback(err, null);

            // });
            database.fetchOffenderEmail(offenderName, function(err, result){
              if(database.sendMail(result, offenceType)){
                res.send("Successful");
                return
              }
            });
          }else{
            res.send(null);
          }})}
  });

  return router;
}



module.exports=LogOffence;

