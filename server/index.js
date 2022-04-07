const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors")
const mysql = require('mysql');

const db = mysql.createPool({
    host:'localhost',
    user: 'root',
    password: 'password',
    database:'sdDataBase'
});


app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

app.post("/createLog" , (req , res)=> {   
    // post request to add a log
    const offenderName = req.body.offenderName;
    const offenceType = req.body.offenceType;
    const offenceDetails = req.body.offenceDetails;
    const offenceCode = req.body.offenceCode;
    const offenceLink = req.body.offenceLink;
    const offenceOther = req.body.offenceOther;
    const file=req.body.file;
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

app.get("/viewSubmittedOffences", (req,res)=>{ //fetch the data from the database to send to frontend
    const sqlSelect="select offender_name, (case when offence_list.offence_name='other' then other.offence_name else offence_list.offence_name end) as offence_name,crs_code from logged_offences left join offence_list on logged_offences.offence_id= offence_list.offence_id left join other on logged_offences.ticket_id=other.ticket_id";
    db.query(sqlSelect, (error, result) => {
        res.send(result);
    });
});

app.get("/viewPossibleOffences", (req,res)=>{
    const sqlSelect="select offence_name, severity from offence_list where offence_name != 'other'";
    db.query(sqlSelect, (error, result)=>{
        res.send(result);
    });
});

//------------------------------------------------------------login
app.post("/apiLogin/getInfo",(req, res) => {
    const setlgEmail = req.body.setlgEmail;
    console.log( setlgEmail);
    const sqlLgget = "Select user_id, password, role from users where email = ?";
    db.query(sqlLgget,[setlgEmail],(err, result) => {
        console.log(result);
        res.send(result);
    });
});
//-------------------------------------------------------------end login

//-------------------------------------------------------------viewedit offence list
app.post("/adjustlist/select", (req, res)=> {
    const offencename = "Plagiarism";
    const sqlSelect = "SELECT offence_name FROM offence_list WHERE offence_name = ?";
    db.query(sqlSelect,[offencename],(err,result) =>{
        console.log(result);
    });
});
     
app.post("/adjustlist/insert", (req, res)=>{
    const offencename = req.body.offencename;
    const severity = req.body.severity;
    
    const sqlSelect = "SELECT offence_name FROM offence_list WHERE offence_name = ?";
    db.query(sqlSelect,[offencename],(err,result) => {
        console.log(err);
        res.send(result);
        let offlength = result.length;
        console.log(offlength);
        if  (offlength> 0){
            alert('Offense already added');
        } 
        else{
            const sqlinsert = "INSERT INTO offence_list(offence_name,severity) VALUES(?,?)";
            db.query(sqlinsert,[offencename,severity],[err,request ]);
            alert('New offence added');
        }
    });
});

app.post("/adjustlist/update",(req, res) =>{
    const severity = req.body.severity;
    const uOffencename = req.body.offencename;

    const sqlSelect = "SELECT FROM offence_list WHERE offence_name = ?";
    
    db.query(sqlSelect,[uOffencename],(err,result) => {
        let offlength = result.length;
        if  (offlength> 0){
            alert("Offence not found");
        }
        else{
            const sqlupdate= "UPDATE offence_list SET severity = ? WHERE offence_name = ?";
            db.query(sqlupdate,[severity,uOffencename],(err,result));
            alert("Offence updated");
        }
    });
    

});

app.post("/adjustlist/delete", (req, res) => {
    const dOffencename = req.body.offencename;
    const sqldelete= "DELETE FROM offence_list WHERE offence_name = ?";
    db.query(sqldelete,[dOffencename],(err,result));
    alert("Offence deleted")
});

//-------------------------------------------------------------end viewedit offence list



app.listen(3001, () => {
    console.log("running on port 3001");
});
