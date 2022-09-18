import makeApp from '../index';
const request = require("supertest");
import { jest } from '@jest/globals'
// const app = makeApp({}); //  !! put db  //require("./server/index"); //server\index.js
// const  database = require( './database.js');


describe("Test login", ()=>{

    test("Status when email not given",()=>{
        const login={
            setlgPassword: "test"
        };
        return request(app)
        .post("/Login")
        .send(login)
        .expect({}).then(()=> expect(Login.mock.calls.length).toBe(0) );
    });

    test("Status when password not given",()=>{
        const login={
            setlgEmail: "test@gmail.com"
        };
        return request(app)
        .post("/Login")
        .send(login)
        .expect({}).then(()=> expect(Login.mock.calls.length).toBe(0));
    });


    test("Status when both given, and order of params",()=>{
        const login={
            setlgEmail: "test@gmail.com",
            setlgPassword: "test"
        };
        return request(app)
        .post("/Login")
        .send(login).expect(200).then(()=>  {
            expect(Login.mock.calls.length).toBe(1);
            expect(Login.mock.calls[0][0]).toBe("test@gmail.com")
            expect(Login.mock.calls[0][1]).toBe("test")
        });
    });
});

describe("Test possible offences", ()=>{
    test("test get possible offences", ()=>{
        return request(app)
        .get('/PossibleOffences')
        .expect(200).then(()=> expect(PossibleOffences.mock.calls.length).toBe(1));
    });
});

describe("Test submitted offences", ()=>{
    test("Get method for sumitted offences", ()=>{
        return request(app)
        .get('/SubmittedOffences')
        .expect(200).then(()=> expect(SubmittedOffences.mock.calls.length).toBe(1));
    })
})

describe("Test insert offences", ()=>{
    test("If incorrect arguments sent", ()=>{
        const insertOf={
            offenceName: "Fabien",
        };
        return request(app)
        .post('/insert').send(insertOf)
        .expect({}).then(()=> expect(insert.mock.calls.length).toBe(0));
    })

    test("If correct arguments sent", ()=>{
        const insertOf={
            offenceName: "Fabien",
            severity: "High",
            desc: "Some description"
        };
        return request(app)
        .post('/insert').send(insertOf)
        .expect(200).then(()=> expect(insert.mock.calls.length).toBe(1));
    })
})


describe("Test Investigation", ()=>{
    test('It should test fileNumber (incorrect number of arg sent)', ()=>{
        return request(app)
        .get('/fileNumber')
        .expect({});
    })
    test('It should test fileNumber (correct number of arg sent)', ()=>{
        return request(app)
        .get('/fileNumber')
        .query({ticket_id: 1})
        .expect({});
    })
    test('It should test viewTicketFiles (incorrect number of arg sent)', ()=>{
        return request(app)
        .get('/viewTicketFiles')
        .query({ticketID: 1})
        .expect({});
    })
    test('It should test viewTicketFiles (correct number of arg sent)', ()=>{
        return request(app)
        .get('/viewTicketFiles')
        .query({id: 1})
        .query({i: 1})
        .expect({});
    })
    test('It should test myHearing', ()=>{
        return request(app)
        .get('/myHearing')
        .query({ticketID: 1})
        .expect(200).then(()=> expect(myHearing.mock.calls.length).toBe(1));
    })

    test('It should test ticketTracker', ()=>{
        return request(app)
        .get('/ticketTracker')
        .query({ticketID: 1})
        .expect(200).then(()=> expect(ticketTracker.mock.calls.length).toBe(1));
    })
    test('It should test viewMyOffences', ()=>{
        return request(app)
        .get('/viewMyOffences')
        .query({userID: 1})
        .expect(200).then(()=> expect(viewMyOffences.mock.calls.length).toBe(1));
    })

    test("It should test viewMyOffences (incorrect number of arg sent)", ()=>{
        const insert={
            studNo: "1",
            meetDate: "24/02/2022",
            meetLink: "somelink",
        };
        return request(app)
        .post('/insertOI').send(insert)
        .expect({}).then(()=> expect(insertOI.mock.calls.length).toBe(0));
    })

    test("It should test viewMyOffences (correct number of arg sent)", ()=>{
        const insert={
            studNo: "1",
            meetDate: "24/02/2022",
            meetLink: "somelink",
            ticket_id: "1"
        };
        return request(app)
        .post('/insertOI').send(insert)
        .expect(200).then(()=> expect(insertOI.mock.calls.length).toBe(1));
    })

    test("It should test updateOI (incorrect number of arg sent)", ()=>{
        const insert={
            ticket_id: "1",
        };
        return request(app)
        .post('/updateOI').send(insert)
        .expect({}).then(()=> expect(updateOI.mock.calls.length).toBe(0));
    })

    test("It should test updateOI (correct number of arg sent)", ()=>{
        const insert={
            ticket_id: "1",
            offence_status: "Guilty",
        };
        return request(app)
        .post('/updateOI').send(insert)
        .expect(200).then(()=> expect(updateOI.mock.calls.length).toBe(1));
    })

    test("It should test sendhelp (incorrect number of arg sent)", ()=>{
        const insert={
        };
        return request(app)
        .post('/sendhelp').send(insert)
        .expect({}).then(()=> expect(getEmail.mock.calls.length).toBe(0));
    })

    test("It should test sendhelp (correct number of arg sent)", ()=>{
        const insert={
            stdNo: "1",
        };
        return request(app)
        .post('/sendhelp').send(insert)
        .expect(200).then(()=> expect(getEmail.mock.calls.length).toBe(1));
    })

    test("It should test sendMeetEmail (incorrect number of arg sent)", ()=>{
        const insert={
        };
        return request(app)
        .post('/sendMeetEmail').send(insert)
        .expect({}).then(()=> expect(getEmail.mock.calls.length).toBe(1));
    })

    test("It should test sendMeetEmail (correct number of arg sent)", ()=>{
        const insert={
            stdNo: "1",
            meetDate: "date",
            meetLink: "link"
        };
        return request(app)
        .post('/sendMeetEmail').send(insert)
        .expect(200).then(()=> expect(getEmail.mock.calls.length).toBe(2));
    })
    test("It should test sendMeetEmail (incorrect number of arg sent)", ()=>{
        const insert={
        };
        return request(app)
        .post('/sendMeetEmail').send(insert)
        .expect({}).then(()=> expect(getEmail.mock.calls.length).toBe(2));
    })

    test("It should test sendMeetEmail (correct number of arg sent)", ()=>{
        const insert={
            ticket_id: "1",
            status: "Guilty",
            stdNo: "1234567"
        };
        return request(app)
        .post('/sendMeetEmail').send(insert)
        .expect(200).then(()=> expect(getEmail.mock.calls.length).toBe(3));
    })
    test('It should test getAllMeetings', ()=>{
        return request(app)
        .get('/getAllMeetings')
        .expect(200).then(()=> expect(getAllMeetings.mock.calls.length).toBe(1));
    })
})


describe("Test Session", ()=>{
    test("It should test createTest (incorrect number of arg sent)", ()=>{
        const insert={
        };
        return request(app)
        .post('/createTest').send(insert)
        .expect({}).then(()=> expect(createTest.mock.calls.length).toBe(0));
    })

    test("It should test createTest (correct number of arg sent)", ()=>{
        const insert={
            testName: "1",
            pledgeID: "Guilty",
            courseCode: "1234567",
            testDate: "date",
            creatorID: "1"
        };
        return request(app)
        .post('/createTest').send(insert)
        .expect(200).then(()=> expect(createTest.mock.calls.length).toBe(0));
    })

    test("It should test sessionPledgeLink (incorrect number of arg sent)", ()=>{
        return request(app)
        .get('/sessionPledgeLink')
        .expect({}).then(()=> expect(sessionPledgeLink.mock.calls.length).toBe(0));
    })

    test("It should test sessionPledgeLink (correct number of arg sent)", ()=>{
        return request(app)
        .get('/sessionPledgeLink').query({pledge_id:1})
        .expect(200).then(()=> expect(sessionPledgeLink.mock.calls.length).toBe(1));
    })

    test("It should test submitSession (incorrect number of arg sent)", ()=>{
        const insert={
        };
        return request(app)
        .post('/submitSession').send(insert)
        .expect({}).then(()=> expect(submitSession.mock.calls.length).toBe(0));
    })

    test("It should test submitSession (correct number of arg sent)", ()=>{
        const insert={
            studentID: 1,
            paragraph: "para",
            sessionID: 1,
            pledgeID: 10,
        };

        return request(app)
        .post('/submitSession').send(insert)
        .expect(200).then(()=> expect(submitSession.mock.calls.length).toBe(1));
    })

    test("It should test testReport (correct number of arg sent)", ()=>{
        return request(app)
        .get('/testReport').query({pledge_id:1})
        .expect(200).then(()=> expect(testReport.mock.calls.length).toBe(1));
    })

    test("It should test insertses (incorrect number of arg sent)", ()=>{
        const insert={
            pledgeID: 10,
            filename: "name"
        };
        return request(app)
        .post('/insertses').send(insert)
        .expect({}).then(()=> expect(insertses.mock.calls.length).toBe(0));
    })

    test("It should test insertses (correct number of arg sent)", ()=>{
        const insert={
            course_id: 1,
            sestype: "para",
            date: 1,
            time: 10,
            session_name: "name",
            creator_id:1,
            pledges: "pledge"
        };
        return request(app)
        .post('/insertses').send(insert)
        .expect(200).then(()=> expect(insertses.mock.calls.length).toBe(1));
    })

    test("It should test updateses (incorrect number of arg sent)", ()=>{
        const insert={
            pledgeID: 10,
            filename: "name"
        };
        return request(app)
        .post('/updateses').send(insert)
        .expect({}).then(()=> expect(updateses.mock.calls.length).toBe(0));
    })

    test("It should test updateses (correct number of arg sent)", ()=>{
        const insert={
            session_id: 1,
            date: 1,
            time: 10,
            session_name: "name",
        };
        return request(app)
        .post('/updateses').send(insert)
        .expect(200).then(()=> expect(updateses.mock.calls.length).toBe(1));
    })
})

describe("Test LogOffence", ()=>{
    test("It should test LogOffenceNoFile (incorrect number of arg sent)", ()=>{
        const insert={
            offenderName: 10,
            offenceType: "name",
            offenceDetails: "details",
            offenceCode: 1,
            offenceOther : "none",
            offenceStatus:"Guilty",
        };
        return request(app)
        .post('/LogOffenceNoFile').send(insert)
        .expect({}).then(()=> expect(LogOffenceNoFile.mock.calls.length).toBe(0));
    })

    test("It should test LogOffenceNoFile (correct number of arg sent)", ()=>{
        const insert={
            offenderName: 10,
            offenceType: "name",
            offenceDetails: "details",
            offenceCode: 1,
            offenceOther : "none",
            offenceStatus:"Guilty",
            submittedBy: "fabien"
        };
        return request(app)
        .post('/LogOffenceNoFile').send(insert)
        .expect(200).then(()=> expect(LogOffenceNoFile.mock.calls.length).toBe(1));
    })

    test("It should test LogOffenceNoFile (incorrect number of arg sent)", ()=>{
        const insert={
            offenderName: 10,
            offenceType: "name",
            offenceDetails: "details",
            offenceCode: 1,
            offenceOther : "none",
            offenceStatus:"Guilty",
        };
        return request(app)
        .post('/LogOffence').send(insert)
        .expect({}).then(()=> expect(LogOffence.mock.calls.length).toBe(0));
    })

    test("It should test LogOffence (correct number of arg sent)", ()=>{
        const insert={
            offenderName: 10,
            offenceType: "name",
            offenceDetails: "details",
            offenceCode: 1,
            offenceOther : "none",
            offenceStatus:"Guilty",
            submittedBy: "fabien"
        };
        return request(app)
        .post('/LogOffence').send(insert)
        .expect(200).then(()=> expect(LogOffence.mock.calls.length).toBe(1));
    })

    test("It should test addCheckList", ()=>{
        return request(app)
        .get('/addCheckList')
        .expect(200).then(()=> expect(addCheckList.mock.calls.length).toBe(1));
    })

    test("It should test addCheckListQuestion (incorrect number of arg sent)", ()=>{
        const insert={
            offenderName: 10,
            offenceType: "name",
        };
        return request(app)
        .post('/addCheckListQuestion').send(insert)
        .expect({}).then(()=> expect(addCheckListQuestion.mock.calls.length).toBe(0));
    })

    test("It should test addCheckListQuestion (correct number of arg sent)", ()=>{
        const insert={
            session_id: 10,
            checklist_id: "name",
            question_details: "details",
        };
        return request(app)
        .post('/addCheckListQuestion').send(insert)
        .expect(200).then(()=> expect(addCheckListQuestion.mock.calls.length).toBe(1));
    })

    test("It should test allCheckListQuestions (incorrect number of arg sent)", ()=>{
        const insert={
            session_id: 10,
        };
        return request(app)
        .post('/allCheckListQuestions').send(insert)
        .expect({}).then(()=> expect(allCheckListQuestions.mock.calls.length).toBe(0));
    })

    test("It should test allCheckListQuestions (correct number of arg sent)", ()=>{
        const insert={
            session_id: 10,
            checklist_id: "name",
        };
        return request(app)
        .post('/allCheckListQuestions').send(insert)
        .expect(200).then(()=> expect(allCheckListQuestions.mock.calls.length).toBe(1));
    })
    test("It should test CheckLists", ()=>{
        return request(app)
        .get('/CheckLists')
        .expect(200).then(()=> expect(CheckLists.mock.calls.length).toBe(1));
    })

    
    test("It should test viewCheck_id (incorrect number of arg sent)", ()=>{
        const insert={
        };
        return request(app)
        .post('/viewCheck_id').send(insert)
        .expect({}).then(()=> expect(viewCheck_id.mock.calls.length).toBe(0));
    })

    test("It should test viewCheck_id (correct number of arg sent)", ()=>{
        const insert={
            session_id: 10,
        };
        return request(app)
        .post('/viewCheck_id').send(insert)
        .expect(200).then(()=> expect(viewCheck_id.mock.calls.length).toBe(1));
    })

    test("It should test updateCheckListQuestion (incorrect number of arg sent)", ()=>{
        const insert={
            offenderName: 10,
            offenceType: "name",
        };
        return request(app)
        .post('/updateCheckListQuestion').send(insert)
        .expect({}).then(()=> expect(updateCheckListQuestion.mock.calls.length).toBe(0));
    })

    test("It should test updateCheckListQuestion (correct number of arg sent)", ()=>{
        const insert={
            question_num:1,
            session_id: 10,
            checklist_id: "name",
            question_details: "details",
        };
        return request(app)
        .post('/updateCheckListQuestion').send(insert)
        .expect(200).then(()=> expect(updateCheckListQuestion.mock.calls.length).toBe(1));
    })

    test("It should test deleteCheckListQuestion (incorrect number of arg sent)", ()=>{
        const insert={
            offenderName: 10,
            offenceType: "name",
        };
        return request(app)
        .post('/deleteCheckListQuestion').send(insert)
        .expect({}).then(()=> expect(deleteCheckListQuestion.mock.calls.length).toBe(0));
    })

    test("It should test deleteCheckListQuestion (correct number of arg sent)", ()=>{
        const insert={
            question_num:1,
            session_id: 10,
            checklist_id: "name",
        };
        return request(app)
        .post('/deleteCheckListQuestion').send(insert)
        .expect(200).then(()=> expect(deleteCheckListQuestion.mock.calls.length).toBe(1));
    })

    test("It should test studentChecklistAnswers (incorrect number of arg sent)", ()=>{
        const insert={
            offenderName: 10,
            offenceType: "name",
        };
        return request(app)
        .post('/studentChecklistAnswers').send(insert)
        .expect({}).then(()=> expect(studentChecklistAnswers.mock.calls.length).toBe(0));
    })

    test("It should test studentChecklistAnswers (correct number of arg sent)", ()=>{
        const insert={
            studentID:1,
            checkID: 10,
            questions: "name",
            answers: "name",

        };
        return request(app)
        .post('/studentChecklistAnswers').send(insert)
        .expect(200).then(()=> expect(studentChecklistAnswers.mock.calls.length).toBe(1));
    })
})

const addCheckList= jest.fn(function (c){
    c(null, 200)
});
const studentChecklistAnswers= jest.fn(function (checkID, studentID,questions, answers,c){
    c(null, 200)
});
const deleteCheckListQuestion= jest.fn(function (checklist_id, question_num, session_id, c){
    c(null, 200)
});
const updateCheckListQuestion= jest.fn(function (question_details, checklist_id, question_num, session_id,c){
    c(null, 200)
});
const CheckLists= jest.fn(function (c){
    c(null, 200)
});
const viewCheck_id= jest.fn(function (session_id,c){
    c(null, 200)
});
const addCheckListQuestion= jest.fn(function (checklist_id, session_id, question_details,c){
    c(null, 200)
});
const allCheckListQuestions= jest.fn(function (session_id, checklist_id,c){
    c(null, 200)
});
///
const LogOffence= jest.fn(function (offenderName, offenceID, offenceDetails, offenceCode, offenceStatus, submittedBy,offenceType,offenceOther, c){
    c("null", null)
});
const fetchOffenderEmail= jest.fn(function (offenderName, c){
    c(null, "200")
});
const LogOffenceNoFile= jest.fn(function (offenderName, offenceID, offenceDetails, offenceCode, offenceStatus, submittedBy,offenceType,offenceOther, c){
    c(null, "200")
});
const updateses= jest.fn(function (date, time, session_name, session_id , c){
    c(null, 200)
});
const insertses= jest.fn(function (course_id, session_type, date, time, session_name, creator_id,pledges , c){
    c(null, 200)
});
const insertsesCont= jest.fn(function (session_id,pledges, c){
    c(null, 200)
});
const insertsesUpdateLink= jest.fn(function (dir, session_id, c){
    c(null, 200)
});
const submitSession= jest.fn(function (studentID ,paragraph ,sessionID,pledgeID, c){
    c(null, [{organization_nr: 1}])
});
const testReport= jest.fn(function (ID, c){
    c(null, 200)
});
const selectSession_folder= jest.fn(function (sessionID, c){
    c("null", [{session_folder: "link"}])
});
const sessionPledgeLink= jest.fn(function (id, c){
    c(null, [{pledge_link:"link"}])
});
const createTest= jest.fn(function (testName, testDate, courseCode, creatorID, dir, pledgeID, c){
    c(null, {result:200})
});
const Login = jest.fn(function (e, p , c){
    if(e && p){
        c(null, {result:1})
    }else{
        c(null, null)
    }
});
const ticketTracker= jest.fn(function (ticketID, c){
    c(null, {result:200})
});
const PossibleOffences = jest.fn(function (c){
    c(null, {result:200})
});
const SubmittedOffences = jest.fn(function (c){
    c(null, {result:200})
});
const insert = jest.fn( function (n, s , d,c){
    c(null, {result:200})
});
const myHearing = jest.fn( function (ticket_id,c){
    c(null, {result:200})
});
const viewMyOffences = jest.fn( function (userID,c){
    c(null, {result:200})
});
const insertOI = jest.fn( function (studNo, meetDate, meetLink, ticket_id,c){
    c(null, {result:200})
});
const updateOI = jest.fn( function (ticket_id,offence_status,c){
    c(null, {result:200})
});
const getEmail = jest.fn(function (stdNo,c){
    c(null, "test")
});
const getAllMeetings= jest.fn(function ( c){
    c(null, {result:200})
});
const app = makeApp({insertsesUpdateLink,addCheckList,studentChecklistAnswers,addCheckListQuestion,allCheckListQuestions,CheckLists,deleteCheckListQuestion,viewCheck_id,updateCheckListQuestion,LogOffence,fetchOffenderEmail,LogOffenceNoFile,updateses,insertsesCont,insertses,selectSession_folder,testReport,submitSession,sessionPledgeLink,createTest,getAllMeetings,getEmail,updateOI,insertOI,viewMyOffences,myHearing, Login, PossibleOffences, SubmittedOffences, insert,ticketTracker});
