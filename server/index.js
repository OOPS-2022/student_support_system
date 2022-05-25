const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors")
const mysql = require('mysql2');
const nodemailer = require("nodemailer");
const multer = require("multer");
const uploadSignedPledge = multer({ dest: "./Uploads/Pledges/SignedPledges" });
const uploadStudentPledge = multer({ dest: "./Uploads/Pledges/Test" })
const fs = require('fs');
const { dirname } = require("path");
const uploadEvidenceDoc = multer({ dest: "./Uploads/Evidence" });

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'sddatabase'
});


app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//------------------------------------------------------------login
app.post("/Login", (req, res) => {
    const setlgEmail = req.body.setlgEmail;;
    const setlgPassword = req.body.setlgPassword;;
    const sqlLgget = "Select user_id, role from users where email = ? and password = ?";
    db.query(sqlLgget, [setlgEmail, setlgPassword], (err, result) => {
        if (!result?.[0]) {
            res.send("incorrect");
        } else {
            res.send(result);
        }
    });
});
//-------------------------------------------------------------end login

app.post("/LogOffenceNoFile", (req, res) => {
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
                            if (err !== null) {
                                const sqlDelete = "DELETE FROM logged_offences ORDER BY ticket_id DESC LIMIT 1";
                                db.query(sqlDelete, (err, result));
                                //res.send("Failed");
                                //return;
                            }
                        });

                    }
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
                    const sqlGetStudent = "select user_id from users where organization_nr=?";
                    const sqlInsertAction = "Insert into actions (student_id, tables, table_id, seen, date, action_desc) values (?, ?, ?, ?, ?, ?)";
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

    offenderEmail = "lizlvnjaarsveld@gmail.com"
    let mailOptions = {
        from: "sdteamoops@gmail.com",
        to: offenderEmail,
        subject: "Logged Offence",
        text: "This is an auto generated email.\nA student has reported an offence against you under the category of " + offenceType + ", an investigation into this case will follow."
    }
    transporter.sendMail(mailOptions, function (err, success) {
        if (err) {
            console.log(err);
            res.send("Unable to send email to offender");
        } else {
            console.log("Email sent to " + offenderEmail)
        }
    })

    res.send("Successful");
});

app.post("/LogOffence", uploadEvidenceDoc.single('file'), (req, res) => {
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
                    res.send("Failed");
                    return;
                } else {
                    //create file named for the ticket id
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
                        let newFileName = Date.now() + req.file.originalname;
                        let oldPath = "./Uploads/Evidence/" + req.file.filename;
                        let newPath = "./Uploads/Evidence/ticket" + ticket_id + '/' + newFileName
                        fs.rename(oldPath, newPath, function (err) {
                            console.log(err);
                        });

                        const sqlInsert = "INSERT INTO other (ticket_id, offence_name) VALUES (?,?);";   // insert into log table
                    if (offenceType === "other") {
                        db.query(sqlInsert, [ticket_id, offenceOther], (err, result) => {
                            if (err !== null) {
                                const sqlDelete = "DELETE FROM logged_offences ORDER BY ticket_id DESC LIMIT 1";
                                db.query(sqlDelete, (err, result));
                                //res.send("Failed");
                                //return;
                            }
                        });

                    }
                    const sqlGetStudent = "select user_id from users where organization_nr=?";
                    const sqlInsertAction = "Insert into actions (student_id, tables, table_id, seen, date, action_desc) values (?, ?, ?, ?, ?, ?)";
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

    offenderEmail = "lizlvnjaarsveld@gmail.com"
    let mailOptions = {
        from: "sdteamoops@gmail.com",
        to: offenderEmail,
        subject: "Logged Offence",
        text: "This is an auto generated email.\nA student has reported an offence against you under the category of " + offenceType + ", an investigation into this case will follow."
    }
    transporter.sendMail(mailOptions, function (err, success) {
        if (err) {
            console.log(err);
            res.send("Unable to send email to offender");
        } else {
            console.log("Email sent to " + offenderEmail)
        }
    })

    res.send("Successful");
});

app.get("/PossibleOffences", (req, res) => {
    const sqlSelect = "select offence_id,offence_name, severity ,offence_desc from offence_list where offence_name != 'other'";
    db.query(sqlSelect, (error, result) => {
        res.send(result);
    });
});

app.get("/SubmittedOffences", (req, res) => { //fetch the data from the database to send to frontend
    const sqlSelect = "select logged_offences.ticket_id, offender_name, (case when offence_list.offence_name='other' then other.offence_name else offence_list.offence_name end) as offence_name,crs_code , offence_status from logged_offences left join offence_list on logged_offences.offence_id= offence_list.offence_id left join other on logged_offences.ticket_id=other.ticket_id";
    db.query(sqlSelect, (error, result) => {
        res.send(result);
    });
});

app.get("/offences", (req, res) => {
    const sqlSelect = "select offence_id, offence_name from offence_list where offence_name != 'other'";
    db.query(sqlSelect, (error, result) => {
        res.send(result);
    });
});

app.post("/insert", (req, res) => {
    const offenceName = req.body.offenceName;
    const severity = req.body.severity;
    const desc = req.body.desc;
    const sqlSelect = "Insert into offence_list(offence_name, severity, offence_desc) values(?,?,?)";
    db.query(sqlSelect, [offenceName, severity, desc], (err, result) => {
        console.log(err);
        res.send("inserted");
    });
});

app.get("/selectOffence", (req, res) => {
    const ticket_id = req.query['ticket_id'];
    const sqlSelect = "select * from logged_offences where ticket_id = ?";
    db.query(sqlSelect, [ticket_id], (err, result) => {
        res.send(result[0]);
    });
});

app.post("/delete", (req, res) => {
    const offenceId = req.body.offenceId;
    const sqlSelect = "Delete from offence_list where offence_id = ?";
    db.query(sqlSelect, [offenceId], (err, result) => {
        if (err == null) {
            res.send("deleted");
        }
    });
});

app.post("/update", (req, res) => {
    const offenceName = req.body.offenceName;
    const severity = req.body.severity;
    const desc = req.body.desc;
    const offenceId = req.body.offenceId;
    const sqlSelect = "UPDATE offence_list SET severity = ?, offence_name =?, offence_desc=? WHERE offence_id = ?";
    db.query(sqlSelect, [severity, offenceName, desc, offenceId], (err, result) => {
        res.send("updated");

    });
});

app.get("/viewPledges", (req, res) => {
    const sqlSelect = "select pledge_id, pledge_name, pledge_desc, pledge_type from pledges";
    db.query(sqlSelect, (error, result) => {

        res.send(result);
    });
})

app.get('/viewFile', function (req, res) {
    //var filePath = "/Uploads/Pledges/SignedPledges/1650355918774Plagiarism Pledge.pdf"; //this will be what gets saved in database
    const id = req.query['id']; //gets id from frontend
    //var filePath1;
    const sqlSelect = "select pledge_link from pledges where pledge_id = ?";
    db.query(sqlSelect, [id], (error, result) => {
        //res.send(result);
        const filePath = result[0].pledge_link;

        if (error != null) {
            console.log(error)
        }

        fs.readFile(__dirname + filePath, function (err, data) {
            res.contentType("application/pdf");
            res.send(data);
            //console.log(__dirname);
        });
    });
});

app.get('/fileNumber', function (req, res) {
    const id = req.query['ticket_id'];
    let directory_name = 'Uploads/Evidence/ticket' + id;
    let filenames = fs.readdirSync(directory_name);
    let result = filenames.length.toString();
    res.send(result);
})

app.get('/viewTicketFiles', function (req, res) {
    const id = req.query['id'];
    const i = req.query['i'];
    let directory_name = 'Uploads/Evidence/ticket' + id;
    let filenames = fs.readdirSync(directory_name,  { withFileTypes: true });
    let filePath =   directory_name + '/' + filenames[i].name;
    fs.readFile(__dirname +"/"+filePath, function (err, data) {
        console.log(__dirname +"/"+filePath);
        res.contentType("application/pdf");
        console.log(err);
        res.send(data);
        //console.log(__dirname);
    });
        
        //console.log(__dirname);
  
        //let blob = new Blob([data], {type: 'application / PDF'});
  

})
app.get('/ticketTracker', (req,res)=>{
    const ticketID=req.query['ticketID'];
    const sqlSelect='select * from investigation_record where ticket_id=?';
    db.query(sqlSelect, [ticketID], (err,result)=>{
        if (err!=null){
            console.log(err)
        }
        res.send(result)
    })
})

app.get('/myHearing', (req,res)=>{
    const ticket_id=req.query['ticket_id']
    const sqlSelect='select * from meetings where ticket_id=?';
    db.query(sqlSelect, [ticket_id], (err,result)=>{
        if (err!=null){
            console.log(err)
        }
        res.send(result)
    })
})

app.get('/viewMyOffences', (req, res) => {
    const userID = req.query['userID'];
    const sqlSelectNr = "select organization_nr from users where user_id=?";
    db.query(sqlSelectNr, [userID], (err, result) => {
        let orgNum=result[0].organization_nr;
        const sqlSelect = "select offender_name, (case when offence_list.offence_name='other' then other.offence_name else offence_list.offence_name end) as offence_name,logged_offences.ticket_id,crs_code, offence_status from logged_offences left join offence_list on logged_offences.offence_id= offence_list.offence_id left join other on logged_offences.ticket_id=other.ticket_id where offender_name=?";
        db.query(sqlSelect, [orgNum], (err, result) => {
            res.send(result);
        });

    })

})

app.post("/createSignedPledge", uploadSignedPledge.single("file"), (req, res) => { //creating a signed pledge
    //let fileType=req.file.mimetype.split("/")[1];
    let newFileName = Date.now() + req.file.originalname;
    let oldPath = "./Uploads/Pledges/SignedPledges/" + req.file.filename;
    let newPath = "./Uploads/Pledges/SignedPledges/" + newFileName
    let saveLink = "/Uploads/Pledges/SignedPledges/" + newFileName
    fs.rename(oldPath, newPath, function (err) {
        console.log(err);
        res.send("200");
    });
    const name = req.body.name;
    const desc = req.body.desc;
    const type = "Signed Pledge"
    const sqlInsert = "INSERT INTO pledges (pledge_name, pledge_desc, pledge_type, pledge_link) VALUES (?,?,?,?);";   // insert into log table
    db.query(sqlInsert, [name, desc, type, saveLink], (err, res) => {
        if (err != null) {
            console.log(err)
        }
    });
});

app.post('/createClickedPledge', function (req, res) {
    const name = req.body.name;
    const desc = req.body.desc;
    const pledge_type = "Clicked Pledge"
    const sqlInsert = "INSERT INTO pledges (pledge_name, pledge_desc, pledge_type) VALUES (?,?,?);";
    db.query(sqlInsert, [name, desc, pledge_type], (error, result) => {
        if (error != null) {
            console.log(error)
        }
    })
})


app.post("/insertOI", (req, res) => {
    const studNo = req.body.studNo;
    const meetDate = req.body.meetDate;
    const meetLink = req.body.meetLink;
    const ticket_id = req.body.ticket_id;
    const sqlInsertMeeting = "Insert into meetings (studNo, meetDate, meetLink,ticket_id) values(?,?,?,?)";
    const sqlSelect = "Select user_id from users where organization_nr=?";
    const sqlInsertAction = "Insert into actions (student_id, tables, table_id, seen, date, action_desc) values (?, ?, ?, ?, ?, ?)";
    db.query(sqlInsertMeeting, [studNo, meetDate, meetLink, ticket_id], (err, result) => {
        if (err != null) {
            console.log(err)
        }
        else {
            let student_id;
            db.query(sqlSelect, [studNo], (err, result) => {
                if (err != null) {
                    console.log(err)
                }
                else {
                    console.log(result)
                    student_id = result[0].user_id;
                    let table = "meeting";
                    let tableID = ticket_id;
                    let seen = "false";
                    let date = new Date().toISOString().slice(0, 10);
                    let actionDesc = "Hearing has been scheduled";
                    db.query(sqlInsertAction, [student_id, table, tableID, seen, date, actionDesc], (err, result) => {
                        if (err != null) {
                            console.log(err)
                        }
                        else {
                            res.send("successful")
                        }
                    })
                }


            })
        }
    });
});

app.post("/updateOI", (req, res) => {
    const ticket_id = req.body.ticket_id;
    const offence_status = req.body.offence_status;
    const sqlSelect = "UPDATE logged_offences SET offence_status = ? WHERE ticket_id = ?";
    db.query(sqlSelect, [offence_status, ticket_id], (err, result) => {
        if (err!=null){
            console.log(err)
        }
        else{
            let student_id;
            const sqlGetStudent="select user_id from users left join logged_offences on offender_name=organization_nr where ticket_id=?;"
            db.query(sqlGetStudent, [ticket_id], (err, result) => {
                if (err != null) {
                    console.log(err)
                }
                else {
                    console.log(result)
                    student_id = result[0].user_id;
                    let table = "logged_offences";
                    let tableID = ticket_id;
                    let seen = "false";
                    let date = new Date().toISOString().slice(0, 10);
                    let actionDesc = "Your offence ticket has been updated";
                    const sqlInsertAction = "Insert into actions (student_id, tables, table_id, seen, date, action_desc) values (?, ?, ?, ?, ?, ?)";
                    db.query(sqlInsertAction, [student_id, table, tableID, seen, date, actionDesc], (err, result) => {
                        if (err != null) {
                            console.log(err)
                        }
                        else {
                            res.send("successful")
                        }
                    })
                }


            })
        }
    });
});
app.post("/sendhelp", (req, res) => {
    const stdNo = req.body.stdNo;
    const sqlSelect = 'select email from users where organization_nr=?';
    db.query(sqlSelect, [stdNo], (err, result) => {
        const stdEmail = result[0].email;
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

        offenderEmail = stdEmail;
        let mailOptions = {
            from: "sdteamoops@gmail.com",
            to: offenderEmail,
            subject: "Help Report",
            text: "This is an auto generated email.\nYour Help request has been sent and will be attended to shortly. \n Thank you"
        }
        transporter.sendMail(mailOptions, function (err, success) {
            if (err) {
                console.log(err);
                res.send("Unable to send email to offender");
            } else {
                console.log("Email sent to " + offenderEmail)
            }
        })
    })


    res.send("Successful");
});

app.post("/sendMeetEmail", (req, res) => {
    const date = req.body.meetDate;
    const link = req.body.meetLink;
    const stdNo = req.body.stdNo;
    const sqlSelect = 'select email from users where organization_nr=?';
    db.query(sqlSelect, [stdNo], (err, result) => {
        const stdEmail = result[0].email
        let smtpTransport = nodemailer.createTransport({
            service: 'Gmail',
            port: 465,
            auth: {
                user: 'sdteamoops@gmail.com',
                pass: 'SD1Team1OOPS!'
            }
        });


        let mailOptionss = {
            from: '<sdteamoops@gmail.com',
            to: stdEmail, //-------------------put stdEmail 
            subject: 'Hearing - scheduled date',
            text: "This is an auto generated email , please dont reply to this email.\n \n You have a hearing on the " + date
                + " \n \n Link for meeeting: " + link

        };

        smtpTransport.sendMail(mailOptionss, (error, response) => {
            if (error) {
                res.send(error)
                console.log(error)
            }
            else {
                res.send('Success')
                console.log("success")
            }
        })
        smtpTransport.close();
    })

})
app.post("/UploadEvidence", uploadEvidenceDoc.single("file"), (req, res) => {
    //let fileType=req.file.mimetype.split("/")[1];
    const ticketID = req.body.ticket_id;
    let newFileName = Date.now() + req.file.originalname;
    let oldPath = "./Uploads/Evidence/" + req.file.filename;
    let newPath = "./Uploads/Evidence/ticket" + ticketID + '/' + newFileName
    fs.rename(oldPath, newPath, function (err) {
        console.log(err);
        res.send("200");
    });
})

app.post("/sendUpdateEmail", (req, res) => {
    const ticketId = req.body.ticket_id;
    const status = req.body.status;
    const stdNo = req.body.stdNo;
    const sqlSelect = 'select email from users where organization_nr=?';
    db.query(sqlSelect, [stdNo], (err, result) => {
        const stdEmail = result[0].email
        let smtpTransport = nodemailer.createTransport({
            service: 'Gmail',
            port: 465,
            auth: {
                user: 'sdteamoops@gmail.com',
                pass: 'SD1Team1OOPS!'
            }
        });


        let mailOptionss = {
            from: '<sdteamoops@gmail.com',
            to: stdEmail, //-------------------put stdEmail 
            subject: 'Offence Status Update',
            text: "This is an auto generated email , please dont reply to this email.\n \n Ticket " + ticketId
                + " has been updated to: " + status

        };

        smtpTransport.sendMail(mailOptionss, (error, response) => {
            if (error) {
                res.send(error)
                console.log(error)
            }
            else {
                res.send('Success')
                console.log("success")
            }
        })
        smtpTransport.close();
    })

})

app.post('/createTest', (req, res) => {
    const testName = req.body.testName;
    const pledgeID = req.body.pledgeID;
    const courseCode = req.body.courseCode;
    const testDate = req.body.testDate;
    const creatorID = req.body.creatorID;
    const dir = './Uploads/Pledges/Test/' + testName + courseCode;
    fs.mkdir(dir, err => {
        if (err) {
            throw err;
        }
    })
    const sqlInsert = "INSERT INTO tests (test_name, test_date, course_code, creator_id, test_link, pledge_id) VALUES (?,?,?,?,?,?);";   // insert into log table
    db.query(sqlInsert, [testName, testDate, courseCode, creatorID, dir, pledgeID], (err, res) => {
        if (err != null) {
            console.log(err)
        }
    });
});

app.get('/testPledge', function (req, res) {
    //var filePath = "/Uploads/Pledges/SignedPledges/1650355918774Plagiarism Pledge.pdf"; //this will be what gets saved in database
    const id = req.query['testID']; //gets id from frontend
    //var filePath1;
    const sqlSelect = "SELECT pledge_link FROM tests left join pledges on tests.pledge_id=pledges.pledge_id where test_id= ?";
    db.query(sqlSelect, [id], (error, result) => {
        //res.send(result);
        //console.log(result[0].pledge_link)
        const filePath = result[0].pledge_link;
        if (error != null) {
            console.log(error)
        }

        fs.readFile(__dirname + filePath, function (err, data) {
            res.contentType("application/pdf");
            res.send(data);
            //console.log(__dirname);
        });
    });


});

app.post("/doTest", uploadStudentPledge.single("file"), (req, res) => { //uploading the pledge that student signed before test
    //get student nr from database and then do upload!!!!
    const studentID = req.body.studentID;
    const paragraph = req.body.paragraph;
    const testID = req.body.testID;

    const sqlSelect = "select organization_nr from users where user_id =?";
    db.query(sqlSelect, [studentID], (error, result) => {
        console.log(error);
        const studentNr = result[0].organization_nr;

        const sqlSelectURL = "select test_link from tests where test_id=?";
        db.query(sqlSelectURL, [testID], (error, result) => {
            const testLink = result[0].test_link;

            let newFileName = studentNr + ".pdf";
            let oldPath = "./Uploads/Pledges/Test/" + req.file.filename;
            let newPath = testLink + "/" + newFileName;
            let saveLink = newPath.slice(1);
            fs.rename(oldPath, newPath, function (err) {
                console.log(err);
                res.send("200");
            });

            const sqlInsert = "INSERT INTO pledge_submissions (student_id, test_id, pledge_link, paragraph) VALUES (?,?,?,?);";   // insert into log table
            db.query(sqlInsert, [studentID, testID, saveLink, paragraph], (err, res) => {
                if (err != null) {
                    console.log(err)
                }
            });

        });


    });



})

app.get("/testReport", (req, res) => { ///this is to display which students have completed the pledge
    const id = req.query['testID'];
    const sqlSelect = "select organization_nr, name, surname, paragraph from pledge_submissions left join users on user_id = student_id where test_id=?";
    db.query(sqlSelect, [id], (error, result) => {
        res.send(result);
    });
})

app.get('/pledgeType', function (req, res) {
    const testID = req.query['testID'];
    sqlSelect = 'SELECT pledge_type, pledge_desc FROM tests left join pledges on tests.pledge_id=pledges.pledge_id where test_id=?;';
    db.query(sqlSelect, [testID], (error, result) => {
        res.send(result[0]);
    })
})

app.get('/myActions', (req,res)=>{
    const studentNr=req.query['studentID'];
    console.log(studentNr);
    const sqlSelect='select * from actions where student_id=? and seen="false";';
    db.query(sqlSelect, [studentNr], (err, result)=>{
        if (err!=null){
            console.log(err)
        }
        else{
            console.log(result)
            res.send(result);
        }
    })
})

app.post("/insertses", (req, res) => {
    const course_id = req.body.course_id;
    const session_type = req.body.sestype;
    const date = req.body.date ;
    const time = req.body.time;
    const session_name=req.body.session_name;
    const creator_id=req.body.creator_id;
    const sqlInsert = "Insert into sessions (course_id,session_type,date,time,session_name, creator_id) values(?,?,?,?,?,?)";
    db.query(sqlInsert, [course_id,session_type,date,time,session_name, creator_id], (err, result) => {
        if(err!=null){
            res.send(err)
            console.log(err);
        }
        else{
            const sqlGetId = "SELECT session_id FROM sessions ORDER BY session_id DESC LIMIT 1";//get last  created session
            db.query(sqlGetId, (err, result)=>{
                let session_id=result[0].session_id;
                const sqlGetStudents="select user_id from sessions left join session_link on sessions.session_id=session_link.session_id left join course_link on sessions.course_id=course_link.course_id left join student_link on course_link.pro_id=student_link.program_id where sessions.session_id=?;"
                db.query(sqlGetStudents, [session_id], (err, result)=>{
                    console.log(result);
                    for (let i=0; i<result.length;i++){
                        let student_id=result[i].user_id;
                        let table="sessions";
                        let tableID=session_id;
                        let seen="false";
                        let date=new Date().toISOString().slice(0, 10);
                        let actionDesc = "A new session has been uploaded";
                        const sqlInsert="Insert into actions (student_id, tables, table_id, seen, date, action_desc) values (?, ?, ?, ?, ?, ?)";
                        db.query(sqlInsert, [student_id, table, tableID, seen, date, actionDesc], (err, result) => {
                            if (err != null) {
                                console.log(err)
                            }
                        })
                    }
                })
            })
        }

    });
})

app.get("/sessions",(req,res)=>{
    const sqlSelect='select * from sessions';
    db.query(sqlSelect, (err, result)=>{
        if (err!=null){
            console.log(err)
        }
        else{
            console.log(result)
            res.send(result);
        }
    })

})

app.get("/getSession",(req,res)=>{
    const session_id=req.query['session_id'];
    const sqlSelect='select * from sessions where session_id=?';
    db.query(sqlSelect, [session_id], (err, result)=>{
        if (err!=null){
            console.log(err)
        }
        else{
            console.log(result)
            res.send(result);
        }
    })

})

app.post("/updateses", (req, res) => {
    const session_id = req.body.session_id;
    const date = req.body.date;
    const time = req.body.time;
    const session_name=req.body.session_name;
    //console.log(req.body);
    const sqlSelect = "UPDATE sessions SET date = ?, time =?, session_name=? WHERE session_id = ?";
    db.query(sqlSelect, [date,time, session_name,session_id], (err, result) => {
        console.log(err);
        res.send("update");
    });
})

app.get('/mySessions', (req,res)=>{
    const studentID=req.query['studentID'];
    const sqlSelect='select session_type, course_name, course_code, date,time from sessions left join session_link on sessions.session_id=session_link.session_id left join course_link on sessions.course_id=course_link.course_id left join student_link on course_link.pro_id=student_link.program_id left join courses on course_link.course_id=courses.course_id where user_id=?';
    db.query(sqlSelect, [studentID], (err,result)=>{
        if (err!=null){
            console.log(err)
        }
        else{
            res.send(result)
        }
    })
})

app.post('/viewAction', (req,res)=>{
    const actionId=req.body.actionID;
    console.log(actionId);
    const sqlUpdate="Update actions set seen='true' where action_id=?";
    db.query(sqlUpdate, [actionId], (err, result)=>{
        if (err!=null){
            console.log(err)
        }
    })
})

app.get('/getAllMeetings',(req,res)=>{
    const sqlQuerry = 'Select meetLink, meetDate from meetings;';
    db.query(sqlQuerry,(error,result)=>{
        res.send(result);
        console.log(result);
    });
})


app.listen(3001, () => {
    console.log("running on port 3001");
});




