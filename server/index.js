function App(database){
    const express = require("express");

    const app = express();
    const bodyParser = require("body-parser");
    const cors = require("cors");
    const nodemailer = require("nodemailer");
    const multer = require("multer");
    const uploadSignedPledge = multer({ dest: "./Uploads/Pledges/SignedPledges" });
    const uploadStudentPledge = multer({ dest: "./Uploads/SubmittedSessions" });
    const fs = require("fs");
    const { dirname } = require("path");
    const uploadEvidenceDoc = multer({ dest: "./Uploads/Evidence" });
    // const db = require("./database");


    app.use(cors());
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    //------------------------------------------------------------login
    const login=require("./login");// js file where code resides
    app.use('/', login(database));
    // app.use('/Login', login.default(database));

    //-------------------------------------------------------------end login


    //here are still errors!!!!!!!!!!
    //----------------------------Logging an offence (both with and without evidence)
    const logOffence=require("./logOffence");
    app.use('/', logOffence(database));
    //--------------------------end of logging an offence

    //-------------------------managing offences (view possible offences,view submitted offences, add, edit, delete offences)
    const manageOffences=require("./manageOffences");
    app.use('/', manageOffences(database))
    //-----------------------end of managing offences

    //----------------pledges (view pledges, get pledges, create (digned and clicked) pledges)
    const pledges=require('./Pledges');
    app.use('/', pledges(database));
    //----------------end of pledges

    //-----------Actions (view Action and get Actions)
    const actions=require('./Actions');
    app.use('/', actions(database));
    //-------------end of actions

    //---------------investigation (update, meetings, upload evidence, send relevant emails)
    const investigation=require('./Investigation');
    app.use('/', investigation(database));
    //----------------end of investigation

    //-----------------------sessions (create, edit, get sessions submit sessions, get associated pledge)
    const sessions=require('./Sessions');
    app.use('/', sessions(database));
    //------------------------end sessions

    //-------------checklists(create, edit, see answers, get checklist)
    const checklist=require('./Checklist');
    app.use('/', checklist(database));
    //---------------end checklists
    return app
}

module.exports= App;
