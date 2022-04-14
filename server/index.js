const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors")
const mysql = require('mysql');
const nodemailer = require("nodemailer");

const db = mysql.createPool({
    host:'localhost',
    user: 'root',
    password: 'ICTPass7149',
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
    const submittedBy = req.body.submittedBy;
    const offenceStatus = req.body.offenceStatus;
    let offenderEmail = req.body.offenderEmail;

    let offenceID;
    let ticket_id;
    const sqlSelect = "SELECT offence_id FROM offence_list WHERE offence_name = " + mysql.escape(offenceType);  // get offence_id from table
    db.query(sqlSelect, (err, result) => {
        if(result[0] != null){
            offenceID = result[0].offence_id;
            const sqlInsert= "INSERT INTO logged_offences ( offender_name, offence_id, details, crs_code, offence_status, submitter_id ) VALUES (?,?,?,?,?,?);";   // insert into log table
            db.query(sqlInsert, [offenderName,offenceID, offenceDetails,offenceCode, offenceStatus ,submittedBy], (err , result) =>{ 
                if (err !== null){
                    res.send("Failed");
                    return;
                }else{
                    if (offenceType === "other"){
                        const sqlSelect = "SELECT * FROM other ORDER BY ticket_id DESC LIMIT 1";  // get ticket_id the ticket we just created
                        db.query(sqlSelect, (err, result) => {
                            ticket_id = result[0].ticket_id;
                            const sqlInsert= "INSERT INTO other (ticket_id, offence_name) VALUES (?,?);";   // insert into log table
                            db.query(sqlInsert, [ticket_id,offenceOther], (err , result) =>{ 
                                if (err !== null){
                                    const sqlDelete = "DELETE FROM offence_list ORDER BY ticket_id DESC LIMIT 1";  
                                    db.query(sqlDelete, (err, result));
                                    res.send("Failed");
                                    return;
                                }
                            });
                        });
                    }
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

    offenderEmail = "fabien.chiotti@gmail.com"
    let mailOptions = {
        from: "sdteamoops@gmail.com",
        to: offenderEmail,
        subject: "Logged Offence",
        text: "This is an auto generated email.\nA student has reported an offence against you under the category of " + offenceType + ", an investigation into this case will follow."
    }
    transporter.sendMail(mailOptions, function(err, success){
        if(err){
            console.log(err);
            res.send("Unable to send email to offender");
        }else{
            console.log("Email sent to "+ offenderEmail)
        }
    })

    res.send("Successful");
});

app.get("/viewSubmittedOffences", (req,res)=>{ //fetch the data from the database to send to frontend
    const sqlSelect="select offender_name, (case when offence_list.offence_name='other' then other.offence_name else offence_list.offence_name end) as offence_name,crs_code, offence_status from logged_offences left join offence_list on logged_offences.offence_id= offence_list.offence_id left join other on logged_offences.ticket_id=other.ticket_id";
    db.query(sqlSelect, (error, result) => {
        res.send(result);
        console.log(result);
    });
});

app.get("/viewPossibleOffences", (req,res)=>{
    const sqlSelect="select offence_name, offence_desc, severity from offence_list where offence_name != 'other'";
    db.query(sqlSelect, (error, result)=>{
        res.send(result);
        console.log(result)
    });
});

app.get("/offences", (req,res)=>{
    const sqlSelect="select offence_id, offence_name from offence_list where offence_name != 'other'";
    db.query(sqlSelect, (error, result)=>{
        res.send(result);
        console.log(result)
    });
});


//------------------------------------------------------------login
app.post("/apiLogin/getInfo",(req, res) => {
    const setlgEmail = req.body.setlgEmail;
    const setlgPassword = req.body.setlgPassword;
    console.log( setlgEmail);
    const sqlLgget = "Select user_id, role from users where email = ? and password = ?";
    db.query(sqlLgget,[setlgEmail,setlgPassword],(err, result) => {
        if (result[0] == null){
            res.send("incorrect");
        }else{
            res.send(result);
        }
        console.log(result);
    });
});
//-------------------------------------------------------------end login

//-------------------------------------------------------------viewedit offence list
app.post("/insertY",(req, res)=>{
    const offenceName = req.body.offenceName;
    const severity = req.body.severity;
    console.log(offenceName);
    const sqlSelect = "Insert into offence_list(offence_name, severity) values(?,?)";
    db.query(sqlSelect,[offenceName,severity],(err,result)=>{
        console.log("inserted");
        res.send("inserted");
    });
});

app.post("/selectY",(req, res)=>{
    const offenceName = req.body.offenceName;
    const sqlSelect = "select * from offence_list where offence_name = ?";
    db.query(sqlSelect,[offenceName],(err,result)=>{
         console.log(result);
        res.send(result);
    });
});

app.post("/deleteY",(req, res)=>{
    const offenceName = req.body.offenceName;
    const sqlSelect = "Delete from offence_list where offence_name = ?";
    db.query(sqlSelect,[offenceName],(err,result)=>{
        console.log("delete");
        res.send("delete");
    });
});

app.post("/updateY",(req, res)=>{
    const offenceName = req.body.offenceName;
    const serverity = req.body.severity;
    const sqlSelect = "UPDATE offence_list SET severity = ? WHERE offence_name = ?";
    db.query(sqlSelect,[serverity,offenceName],(err,result)=>{
        console.log("update");
        res.send("update");
    });
});
//-------------------------------------------------------------end viewedit offence list



app.listen(3001, () => {
    console.log("running on port 3001");
});
