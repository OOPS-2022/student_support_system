function Pledges(database){
  const express = require("express");
  const router=express.Router();
  const multer = require("multer");
  const uploadSignedPledge = multer({ dest: "./Uploads/Pledges/SignedPledges" });
  const fs = require("fs");

  //query to view the pledges.
  router.get("/viewPledges", (req, res) => {
    database.viewPledges(function(err, result){
      res.send(result);
    })
  });
    
  //query to view pledge file if the pledge is a signed pledge
  router.get("/viewFile", function (req, res) {
      const id = req.query["id"]; //gets id from frontend
      database.viewFile(id, function(err, result){
        const filePath = result[0].pledge_link;
    
        if (error != null) {
          console.log(error);
        }
        //read the file into a blob of content type pdf
        fs.readFile(__dirname + filePath, function (err, data) {
          res.contentType("application/pdf");
          res.send(data);
        });
      })
  });

  //creating a signed pledge, must have pdf that will be downloaded and signed later
  router.post("/createSignedPledge",uploadSignedPledge.single("file"),(req, res) => {
      let newFileName = Date.now() + req.file.originalname; //new name with date to ensure uniqueness and prevernt overwrite
      let oldPath = "./Uploads/Pledges/SignedPledges/" + req.file.filename; //where file has just been uploaded
      let newPath = "./Uploads/Pledges/SignedPledges/" + newFileName;
      let saveLink = "/Uploads/Pledges/SignedPledges/" + newFileName; //link to be saved in database to find pledge pdf with
      fs.rename(oldPath, newPath, function (err) {
        console.log(err);
      });
      const name = req.body.name;
      const desc = req.body.desc;
      const sessions = req.body.sessions;
      const type = "Signed Pledge";
      database.createSignedPledge(name, desc, type, saveLink, sessions , function(err, result){
        res.send(result);
      })
  });

  //creating a clicked pledge, has no file upload
  router.post("/createClickedPledge", function (req, res) {
    const name = req.body.name;
    const desc = req.body.desc;
    const pledge_type = "Clicked Pledge";
    database.createClickedPledge(name, desc, pledge_type ,sessions, function(err, result){
      res.send(result);
    })
  });

  //get pledge description to be added in table...see if same as view pledges
  router.get("/pledgeType", function (req, res) {
      const testID = req.query["testID"];
      database.pledgeType(testID , function(err, result){
        res.send(result);
      })
  });

  return router
}


module.exports=Pledges;