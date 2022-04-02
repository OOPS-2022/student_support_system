const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors")
const mysql = require('mysql');

const db = mysql.createPool({
    host:'localhost',
    user: 'root',
    password: 'ICTPass7149',
    database:'sdDataBase'
});


app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

app.post("/createLog" , (req , res)=> {                     // post request to add a log
    const offenderName = req.body.offenderName;
    const offenceType = req.body.offenceType;
    const offenceDetails = req.body.offenceDetails;
    const offenceCode = req.body.offenceCode;
    const offenceLink = req.body.offenceLink;
    const offenceOther = req.body.offenceOther;
    let offenceID;
    let ticket_id;
    const sqlSelect = "SELECT offence_id FROM offence_list WHERE offence_name = " + mysql.escape(offenceType);  // get offence_id from table
    db.query(sqlSelect, (err, result) => {
        offenceID = result[0].offence_id;
        const sqlInsert= "INSERT INTO logged_offences ( offender_name, offence_id, details, crs_code) VALUES (?,?,?,?);";   // insert into log table
        db.query(sqlInsert, [offenderName,offenceID, offenceDetails,offenceCode], (err , result) =>{ 
            if (err !== null){
                res.send("Failed");
                return;
            }
        });
    });
    if (offenceType === "other"){
        const sqlSelect = "SELECT * FROM other ORDER BY ticket_id DESC LIMIT 1";  // get ticket_id the ticket we just created
        db.query(sqlSelect, (err, result) => {
            ticket_id = result[0].ticket_id;
            const sqlInsert= "INSERT INTO other (ticket_id, offence_name) VALUES (?,?);";   // insert into log table
            db.query(sqlInsert, [ticket_id,offenceOther], (err , result) =>{ 
                if (err !== null){
                    res.send("Failed");

                    const sqlDelete = "DELETE FROM offence_list ORDER BY ticket_id DESC LIMIT 1";  
                    db.query(sqlDelete, (err, result));

                    return;
                }
            });
        });
    }

    res.send("Successful");
    
});


app.listen(3001, () => {
    console.log("running on port 3001");
});
