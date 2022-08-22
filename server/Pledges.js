const express = require("express");
const router=express.Router();
const db = require("./database");
const multer = require("multer");
const uploadSignedPledge = multer({ dest: "./Uploads/Pledges/SignedPledges" });
const fs = require("fs");

//query to view the pledges.
router.get("/viewPledges", (req, res) => {
    const sqlSelect ="select pledge_id, pledge_name, pledge_desc, pledge_type from pledges";
    db.query(sqlSelect, (error, result) => {
      res.send(result);
    });
});
  
//query to view pledge file if the pledge is a signed pledge
router.get("/viewFile", function (req, res) {
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

//creating a signed pledge, must have pdf that will be downloaded and signed later
router.post("/createSignedPledge",uploadSignedPledge.single("file"),(req, res) => {
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
    const sqlInsert ="INSERT INTO pledges (pledge_name, pledge_desc, pledge_type, pledge_link) VALUES (?,?,?,?);"; // insert into pledges table
    db.query(sqlInsert, [name, desc, type, saveLink], (err, res) => {
      if (err != null) {
        console.log(err);
      } else {
        const sqlSelectPledge ="SELECT pledge_id FROM pledges ORDER BY pledge_id DESC LIMIT 1";
        db.query(sqlSelectPledge, (err, result) => {
          if (err != null) {
            console.log(err);
          } else {
            let pledge_id = result[0].pledge_id;
            const sqlInsertSesLink ="Insert into session_link (session_id, pledge_id) values (?,?)";
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

//creating a clicked pledge, has no file upload
router.post("/createClickedPledge", function (req, res) {
  const name = req.body.name;
  const desc = req.body.desc;
  const pledge_type = "Clicked Pledge";
  const sqlInsert = "INSERT INTO pledges (pledge_name, pledge_desc, pledge_type) VALUES (?,?,?);";
  db.query(sqlInsert, [name, desc, pledge_type], (error, result) => {
    if (error != null) {
      console.log(error);
    } 
    else {
      const sqlSelectPledge ="SELECT pledge_id FROM pledges ORDER BY pledge_id DESC LIMIT 1";
      db.query(sqlSelectPledge, (err, result) => {
        if (err != null) {
          console.log(err);
        } 
        else {
          let pledge_id = result[0].pledge_id;
          const sqlInsertSesLink ="Insert into session_link (session_id, pledge_id) values (?,?)";
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

//get pledge description to be added in table...see if same as view pledges
router.get("/pledgeType", function (req, res) {
    const testID = req.query["testID"];
    sqlSelect ="SELECT pledge_type, pledge_desc FROM tests left join pledges on tests.pledge_id=pledges.pledge_id where test_id=?;";
    db.query(sqlSelect, [testID], (error, result) => {
      res.send(result[0]);
    });
});


module.exports=router;