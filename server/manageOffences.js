const express = require("express");
const router=express.Router();
const db = require("./database");

//get request to get list of possible offences, used to display clickable editable table
router.get("/PossibleOffences", (req, res) => {
    const sqlSelect ="select offence_id,offence_name, severity ,offence_desc from offence_list where offence_name != 'other'";
    db.query(sqlSelect, (error, result) => {
      res.send(result);
    });
});
  
//fetch the data from the database to send to frontend to show admin all the offences that have been logged
router.get("/SubmittedOffences", (req, res) => {
    const sqlSelect ="select logged_offences.ticket_id, offender_name, (case when offence_list.offence_name='other' then other.offence_name else offence_list.offence_name end) as offence_name,crs_code , offence_status from logged_offences left join offence_list on logged_offences.offence_id= offence_list.offence_id left join other on logged_offences.ticket_id=other.ticket_id";
    db.query(sqlSelect, (error, result) => {
      res.send(result);
    });
});
  
//do we still use this or is it the same as possible offences??
router.get("/offences", (req, res) => {
    const sqlSelect ="select offence_id, offence_name from offence_list where offence_name != 'other'";
    db.query(sqlSelect, (error, result) => {
      res.send(result);
    });
});
  
//post request to insert a new offence to the database
router.post("/insert", (req, res) => {
    const offenceName = req.body.offenceName;
    const severity = req.body.severity;
    const desc = req.body.desc;
    const sqlSelect ="Insert into offence_list(offence_name, severity, offence_desc) values(?,?,?)";
    db.query(sqlSelect, [offenceName, severity, desc], (err, result) => {
      res.send("inserted");
    });
});
  
//do we still use this??
router.get("/selectOffence", (req, res) => {
    const ticket_id = req.query["ticket_id"];
    const sqlSelect = "select * from logged_offences where ticket_id = ?";
    db.query(sqlSelect, [ticket_id], (err, result) => {
      res.send(result[0]);
    });
});
  
//query called when a possible offence get deleted
router.post("/delete", (req, res) => {
    const offenceId = req.body.offenceId;
    const sqlSelect = "Delete from offence_list where offence_id = ?";
    db.query(sqlSelect, [offenceId], (err, result) => {
      if (err != null) {
        console.log(err);
      }
    });
});
  
//query called a possible offence is edited
router.post("/update", (req, res) => {
    const offenceName = req.body.offenceName;
    const severity = req.body.severity;
    const desc = req.body.desc;
    const offenceId = req.body.offenceId;
    const sqlSelect ="UPDATE offence_list SET severity = ?, offence_name =?, offence_desc=? WHERE offence_id = ?";
    db.query(
      sqlSelect,
      [severity, offenceName, desc, offenceId],
      (err, result) => {
        res.send("updated");
      }
    );
});

module.exports=router;