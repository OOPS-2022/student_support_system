const request = require("supertest");
import { jest } from '@jest/globals'
import makeApp from '../index';

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
const createTest= jest.fn(function (testName, testDate, courseCode, creatorID, dir, pledgeID, c){
    c(null, {result:200})
});
const selectSession_folder= jest.fn(function (sessionID, c){
    c(null, [{session_folder: "link"}])
});
const sessionPledgeLink= jest.fn(function (id, c){
    c(null, [{pledge_link:"link"}])
});
const testReport= jest.fn(function (ID, c){
    c(null, 200)
});
const getSession = jest.fn( function (session_id,c){
    c(null, {result:200})
});

const mySessions = jest.fn( function (studentID,c){
    c(null, {result:200})
});

const getAllSessions = jest.fn( function (c){
    c(null, {result:200})
});

const sessionPledges = jest.fn( function (select_id,c){
    c(null, {result:200})
});

const mkdir= jest.fn(function (dir, c){
    c(null)
});

const renameSeshFile = jest.fn( function (studentNr,sessionLink,file, c){
    c(200);
});

const app = makeApp({renameSeshFile,mkdir,getSession,mySessions,getAllSessions,sessionPledges,testReport,sessionPledgeLink,selectSession_folder,createTest,submitSession,insertsesUpdateLink,insertsesCont,updateses,insertses})
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
        .expect(200).then(()=> expect(createTest.mock.calls.length).toBe(1));
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

    // test('It should test sessions', ()=>{
    //     return request(app)
    //     .get('/sessions')
    //     .expect(200).then(()=> expect(sessions.mock.calls.length).toBe(1));
    // })

    test('It should test getAllSessions', ()=>{
        return request(app)
        .get('/getAllSessions')
        .expect(200).then(()=> expect(getAllSessions.mock.calls.length).toBe(1));
    })

    test('It should test getSession', ()=>{
        return request(app)
        .get('/getSession')
        .query({session_id: 1})
        .expect(200).then(()=> expect(getSession.mock.calls.length).toBe(1));
    })

    test('It should test mySessions', ()=>{
        return request(app)
        .get('/mySessions')
        .query({studentID: 1})
        .expect(200).then(()=> expect(mySessions.mock.calls.length).toBe(1));
    })

    test('It should test sessionPledges', ()=>{
        return request(app)
        .get('/sessionPledges')
        .query({select_id: 1})
        .expect(200).then(()=> expect(sessionPledges.mock.calls.length).toBe(1));
    })

})