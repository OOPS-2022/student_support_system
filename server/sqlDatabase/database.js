const mysql = require("mysql2");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "ICTPass7149",
    database: "sddatabase",
  
  });

//------------------------------------------------------------login
const login = require('./login');

function Login(email , password, callback){
  return login.Login(email , password, callback , db)
}

function FetchRole(email , callback){
  return login.FetchRole(email , callback , db)
}
//-------------------------------------------------------------end login

const logOffence = require('./logOffence');

function LogOffenceNoFile(offenderName, offenceID, offenceDetails, offenceCode, offenceStatus, submittedBy,offenceType,offenceOther , callback){
  return logOffence.LogOffenceNoFile(offenderName, offenceID, offenceDetails, offenceCode, offenceStatus, submittedBy,offenceType,offenceOther , callback , db);
}
  
function fetchOffenderEmail(offenderName, callback){
  return logOffence.fetchOffenderEmail(offenderName, callback, db);
}

function LogOffence(offenderName, offenceID, offenceDetails, offenceCode, offenceStatus, submittedBy,offenceType,offenceOther, callback){
  return logOffence.LogOffence(offenderName, offenceID, offenceDetails, offenceCode, offenceStatus, submittedBy,offenceType,offenceOther, callback, db);
}



////////////////////////////////////////////////////////////////////////////////
const actions = require('./actions')

function myActions(studentNr, callback){
  return actions.myActions(studentNr,callback, db);
}

function viewAction(actionId, callback){
  return actions.viewAction(actionId, callback , db)
}

///////////////////////////////////////////////////////
const checklist = require('./checklist');

function addCheckList(callback){
  return checklist.addCheckList(callback , db)
}

function addCheckListQuestion(checklist_id, session_id, question_details, callback){
  return checklist.addCheckListQuestion(checklist_id, session_id, question_details, callback ,db)
}

function allCheckListQuestions(session_id, checklist_id, callback){
  return checklist.allCheckListQuestions(session_id, checklist_id, callback , db)
}

function CheckLists(callback){
  return checklist.CheckLists(callback, db)
}

function updateCheckListQuestion(question_details, checklist_id, question_num, session_id, callback ){
  return checklist.updateCheckListQuestion(question_details, checklist_id, question_num, session_id, callback , db)
}

function deleteCheckListQuestion(checklist_id, question_num, session_id, callback){
  return checklist.deleteCheckListQuestion(checklist_id, question_num, session_id, callback , db)
}

function viewCheck_id(session_id, callback ){
  return checklist.viewCheck_id(session_id, callback , db)
}

function getChecklistAns(callback ){
  return checklist.getChecklistAns(callback , db)
}

function studentChecklistAnswers(checkID, studentID,questions, answers, callback ){
  return checklist.studentChecklistAnswers(checkID, studentID,questions, answers, callback , db)
}

function checklistForSession(sessionId , callback ){
  return checklist.checklistForSession(sessionId , callback , db)
}


///////////////////////////////////////////////////
const investigation = require('./investigation')

function ticketTracker(ticketID, callback){
  return investigation.ticketTracker(ticketID, callback , db)
}

function myHearing(ticketID, callback){
  return investigation.myHearing(ticketID, callback , db)
}

function viewMyOffences(userID, callback){
  return investigation.viewMyOffences(userID, callback , db)
}

function insertOI(studNo, meetDate, meetLink, ticket_id, callback){
  return investigation.insertOI(studNo, meetDate, meetLink, ticket_id, callback , db)
}

function updateOI(ticket_id,offence_status , callback){
  return investigation.updateOI(ticket_id,offence_status , callback , db)
}

function getEmail(stdNo, callback){
  return investigation.getEmail(stdNo, callback , db)
}

function getAllMeetings(callback){
  return investigation.getAllMeetings(callback, db)
}

function getRole(UserID, TicketID, callback){
  return investigation.getRole(UserID, TicketID, callback, db)
}

function addCollab(email, ticket_id, role, callback){
  return investigation.addCollab(email, ticket_id, role, callback, db);
}

function getPeople(ticket_id, callback){
  return investigation.getPeople(ticket_id, callback, db);
}

function deleteCollab(email, ticket_id, callback){
  return investigation.deleteCollab(email, ticket_id, callback, db);
}

////////////////////////////////////////////////////////////////////////////////
const manageOffences = require('./manageOffences');

function PossibleOffences(callback){
  return manageOffences.PossibleOffences(callback, db);
}

function SubmittedOffences(user_id, callback){
  return manageOffences.SubmittedOffences(user_id, callback, db)
}

function AllSubmittedOffences(callback){
  return manageOffences.AllSubmittedOffences(callback, db)
}

function insert(offenceName, severity, desc , callback ){
  return manageOffences.insert(offenceName, severity, desc , callback , db)
}

function selectOffence(ticket_id , callback ){
  return manageOffences.selectOffence(ticket_id , callback , db)
}

function deleteOffence(offenceId , callback ){
  return manageOffences.deleteOffence(offenceId , callback , db)
}

function update(severity, offenceName, desc, offenceId , callback ){
  return manageOffences.update(severity, offenceName, desc, offenceId , callback , db)
}
////////////////////////////////////////////////////////////////
const pledges = require('./pledges')

function viewPledges(callback ){
  return pledges.viewPledges(callback , db)
}

function viewFile(id , callback ){
  return pledges.viewFile(id , callback , db)
}

function createSignedPledge(name, desc, type, saveLink, sessions , callback ){
  return pledges.createSignedPledge(name, desc, type, saveLink, sessions , callback , db)
}

function createClickedPledge(name, desc, pledge_type ,sessions, callback ){
  return pledges.createClickedPledge(name, desc, pledge_type ,sessions, callback , db)
}

function pledgeType(testID , callback){
  return pledges.pledgeType(testID , callback , db)
}
////////////////////////////////////////////////////////////

const sessions = require('./sessions')

function createTest(testName, testDate, courseCode, creatorID, dir, pledgeID, callback ){
  return sessions.createTest(testName, testDate, courseCode, creatorID, dir, pledgeID, callback , db)
}

function sessionPledgeLink(id, callback){
  return sessions.sessionPledgeLink(id, callback , db)
}

function submitSession(studentID ,paragraph ,sessionID,pledgeID , callback ){
  return sessions.submitSession(studentID ,paragraph ,sessionID,pledgeID , callback , db)
}

function insertCompleted_sessions(studentID, sessionID, pledgeID, saveLink, paragraph, callback ){
  return sessions.insertCompleted_sessions(studentID, sessionID, pledgeID, saveLink, paragraph, callback , db)
}

function selectSession_folder(sessionID , callback ){
  return sessions.selectSession_folder(sessionID , callback , db)
}

function testReport(id, callback){
  return sessions.testReport(id, callback, db)
}

function insertsesUpdateLink(saveLink, session_id, callback ){
  return sessions.insertsesUpdateLink(saveLink, session_id, callback , db)
}

function insertsesCont(session_id,pledges, callback ){
  return sessions.insertsesCont(session_id,pledges, callback , db)
}

function insertses(course_id, session_type, date, time, session_name, creator_id,pledges , callback ){
  return sessions.insertses(course_id, session_type, date, time, session_name, creator_id,pledges , callback , db)
}

function sessionss(callback ){
  return sessions.sessions(callback , db)
}


function getSession(session_id, callback ){
  return sessions.getSession(session_id, callback , db)
}


function updateses(date, time, session_name, session_id , callback ){
  return sessions.updateses(date, time, session_name, session_id , callback , db)
}

function mySessions(studentID, callback ){
  return sessions.mySessions(studentID, callback , db)
}


function getAllSessions(callback){
  return sessions.getAllSessions(callback , db)
}

function sessionPledges(session_id,callback ){
  return sessions.sessionPledges(session_id,callback , db)
}

////////Start of schedule
const schedule=require('./schedule');

function createSchedule(userID, startDate, endDate, callback){
  return schedule.createSchedule(userID, startDate, endDate, callback, db);
}

function timeTableEntry(scheduleID, day, time, desc, callback){
  return schedule.timeTableEntry(scheduleID, day, time, desc, callback, db);
}

function changeTimeTableEntry(scheduleID, day, time, desc, callback){
  return schedule.changeTimeTableEntry(scheduleID, day, time, desc, callback, db);
}

function getScheduleID(userID, callback){
  return schedule.getScheduleID(userID, callback, db);
}

function scheduleNotification(userID, scheduleID, callback){
  return schedule.scheduleNotification(userID, scheduleID, callback, db);
}

function getEmails(callback){
  return schedule.getEmails(callback, db);
}

function getTimeTable(scheduleID, callback){
  return schedule.getTimeTable(scheduleID, callback, db)
}

// other
const fs = require("fs");

function mkdir(dir, c){
    fs.mkdir(dir , (err) => {
      c(err);
    })

}
function rename(ticketID,file,c){
  let newFileName = Date.now() + file.originalname;
  let oldPath = "./Uploads/Evidence/" + file.filename; //file just uploaded
  let newPath = "./Uploads/Evidence/ticket" + ticketID + "/" + newFileName; //move to appropriate diectory named for ticket id
  fs.rename(oldPath, newPath, function (err) {
      c(err);
  });
}

function renameSeshFile(studentNr,sessionLink,file ,c){
  let newFileName = studentNr + ".pdf";
  let newPath = sessionLink + "/" + newFileName;
  let saveLink = newPath.slice(1);
  if(!file){
    c('No File');
    return;
  }
  let oldPath = "./Uploads/SubmittedSessions/" + file.filename;
  fs.rename(oldPath, newPath, function (err) {
    if(err == null){
        c(null, saveLink);
    }else{
        c(err, null);
    }});
}

function renamePledgeFile(file ,c){
      let newFileName = Date.now() + file.originalname; //new name with date to ensure uniqueness and prevernt overwrite
      let oldPath = "./Uploads/Pledges/SignedPledges/" + file.filename; //where file has just been uploaded
      let newPath = "./Uploads/Pledges/SignedPledges/" + newFileName;
      let saveLink = "/Uploads/Pledges/SignedPledges/" + newFileName; //link to be saved in database to find pledge pdf with
      fs.rename(oldPath, newPath, function (err) { 
        console.log(err);
        c(saveLink);
      });
}

function readdirSync(directory_name){
    return fs.readdirSync(directory_name);
}

function readdirSyncwithFileTypes(directory_name, fileType){
    return fs.readdirSync(directory_name, fileType);
}

function readFile(directory_name, c){
    fs.readFile(directory_name, function (err, data) {
        console.log(__dirname + "/" + filePath);
        res.contentType("application/pdf");
        console.log(err);
        res.send(data);
        c(200, data , "application/pdf", err)
        //console.log(__dirname);
      });
}



module.exports={renamePledgeFile,renameSeshFile, mkdir,rename, readFile,readdirSyncwithFileTypes,readdirSync, getTimeTable, getEmails, scheduleNotification, getScheduleID, changeTimeTableEntry, timeTableEntry, createSchedule, getPeople, addCollab, deleteCollab, AllSubmittedOffences, getRole, FetchRole,sessionPledges,getAllSessions,mySessions,updateses,getSession,sessionss,insertsesUpdateLink,insertsesCont,insertses,testReport, selectSession_folder, insertCompleted_sessions,submitSession,sessionPledgeLink,createTest,pledgeType,createClickedPledge,createSignedPledge, viewFile,viewPledges,update, deleteOffence,selectOffence,insert,SubmittedOffences, checklistForSession, studentChecklistAnswers, getChecklistAns,viewCheck_id,deleteCheckListQuestion,updateCheckListQuestion,CheckLists,allCheckListQuestions,addCheckListQuestion,getAllMeetings, getEmail,updateOI,insertOI,viewMyOffences,myHearing,ticketTracker,addCheckList,Login, LogOffence,LogOffenceNoFile, PossibleOffences, myActions, viewAction, fetchOffenderEmail};