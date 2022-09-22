const mysql = require("mysql2");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "password",
    database: "sddatabase_v2",
  
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


////////////////////////////////////////////////////////////////////////////////
const manageOffences = require('./manageOffences');

function PossibleOffences(callback){
  return manageOffences.PossibleOffences(callback, db);
}

function SubmittedOffences(callback){
  return manageOffences.SubmittedOffences(callback, db)
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




module.exports={FetchRole,sessionPledges,getAllSessions,mySessions,updateses,getSession,sessionss,insertsesUpdateLink,insertsesCont,insertses,testReport, selectSession_folder, insertCompleted_sessions,submitSession,sessionPledgeLink,createTest,pledgeType,createClickedPledge,createSignedPledge, viewFile,viewPledges,update, deleteOffence,selectOffence,insert,SubmittedOffences, checklistForSession, studentChecklistAnswers, getChecklistAns,viewCheck_id,deleteCheckListQuestion,updateCheckListQuestion,CheckLists,allCheckListQuestions,addCheckListQuestion,getAllMeetings, getEmail,updateOI,insertOI,viewMyOffences,myHearing,ticketTracker,addCheckList,Login, LogOffence,LogOffenceNoFile, PossibleOffences, myActions, viewAction, fetchOffenderEmail};