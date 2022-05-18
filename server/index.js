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
    db.query(sqlSelect,[offenceType] ,(err, result) => {
        if (result[0] != null) {
            offenceID = result[0].offence_id;
            const sqlInsert = "INSERT INTO logged_offences ( offender_name, offence_id, details, crs_code, offence_status, submitter_id ) VALUES (?,?,?,?,?,?);";   // insert into log table
            db.query(sqlInsert, [offenderName, offenceID, offenceDetails, offenceCode, offenceStatus, submittedBy], (err, result) => {

                    if (offenceType === "other") {
                        const sqlSelect = "SELECT * FROM other ORDER BY ticket_id DESC LIMIT 1";  // get ticket_id the ticket we just created
                        db.query(sqlSelect, (err, result) => {
                            ticket_id = result[0].ticket_id;
                            const sqlInsert = "INSERT INTO other (ticket_id, offence_name) VALUES (?,?);";   // insert into log table
                            db.query(sqlInsert, [ticket_id, offenceOther], (err, result) => {
                                if (err !== null) {
                                    const sqlDelete = "DELETE FROM offence_list ORDER BY ticket_id DESC LIMIT 1";
                                    db.query(sqlDelete, (err, result));
                                    res.send("Failed");
                                    return;
                                }
                            });
                        });
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
    db.query(sqlSelect,[offenceType] ,(err, result) => {
        if (result[0] != null) {
            offenceID = result[0].offence_id;
            const sqlInsert = "INSERT INTO logged_offences ( offender_name, offence_id, details, crs_code, offence_status, submitter_id ) VALUES (?,?,?,?,?,?);";   // insert into log table
            db.query(sqlInsert, [offenderName, offenceID, offenceDetails, offenceCode, offenceStatus, submittedBy], (err, result) => {
                if (err != null) {
                    res.send("Failed");
                    return;
                } else {
                    //create file named for the ticket id
                    const sqlGetId = "SELECT ticket_id FROM logged_offences ORDER BY ticket_id DESC LIMIT 1";
                    db.query(sqlGetId, (err, result) => {
                        let id = result[0].ticket_id;
                        console.log(id)
                        const dir = './Uploads/Evidence/ticket' + id;
                        const saveLink = '/Uploads/Evidence/ticket' + id;
                        fs.mkdir(dir, err => {
                            if (err) {
                                throw err;
                            }
                        })
                        //now insert this directory into database
                        const sqlUpdateLink = 'Update logged_offences set ticket_link=? where ticket_id=?';
                        db.query(sqlUpdateLink, [saveLink, id], (err, result) => {
                            if (err != null) {
                                console.log(err)
                            }
                        })
                        //let fileType=req.file.mimetype.split("/")[1];
                        let newFileName = Date.now() + req.file.originalname;
                        let oldPath = "./Uploads/Evidence/" + req.file.filename;
                        let newPath = "./Uploads/Evidence/ticket" + id + '/' + newFileName
                        fs.rename(oldPath, newPath, function (err) {
                            console.log(err);
                        });
                    })


                    if (offenceType === "other") {
                        const sqlSelect = "SELECT * FROM other ORDER BY ticket_id DESC LIMIT 1";  // get ticket_id the ticket we just created
                        db.query(sqlSelect, (err, result) => {
                            ticket_id = result[0].ticket_id;
                            const sqlInsert = "INSERT INTO other (ticket_id, offence_name) VALUES (?,?);";   // insert into log table
                            db.query(sqlInsert, [ticket_id, offenceOther], (err, result) => {
                                if (err !== null) {
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
    let filePath = '/' + directory_name + '/' + filenames[i];
        
    fs.readFile(__dirname +"/"+filePath, function (err, data) {
        res.contentType("application/pdf");
        res.send(data);
        //console.log(__dirname);
    });
        
        //console.log(__dirname);
  
        //let blob = new Blob([data], {type: 'application / PDF'});
        //console.log("File:", file);
  

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
    const sqlSelect = "Insert into meetings (studNo, meetDate, meetLink,ticket_id) values(?,?,?,?)";
    db.query(sqlSelect, [studNo, meetDate, meetLink, ticket_id], (err, result) => {
        console.log(err);
        res.send("inserted");
    });
});

app.post("/updateOI", (req, res) => {
    const ticket_id = req.body.ticket_id;
    const offence_status = req.body.offence_status;
    const sqlSelect = "UPDATE logged_offences SET offence_status = ? WHERE ticket_id = ?";
    db.query(sqlSelect, [offence_status, ticket_id], (err, result) => {
        res.send("update");
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
    const studentNr=req.query['studentNr'];
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

app.listen(3001, () => {
    console.log("running on port 3001");
});




