const request = require("supertest");
import { jest } from '@jest/globals'
import makeApp from '../index';

const myHearing = jest.fn( function (ticket_id,c){
    c(null, {result:200})
});
const ticketTracker= jest.fn(function (ticketID, c){
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
const sendUpdateEmail= jest.fn(function (stdNo, c){
    c(null, {result:200})
});
const getRole = jest.fn( function (userID, ticketID,c){
    c(null, {result:200})
});
const getAllMeetings= jest.fn(function ( c){
    c(null, {result:200})
});
const getPeople=jest.fn(function (ticket_id, c){
    c(null, {result:200})
})

const deleteCollab=jest.fn(function (email, ticket_id, c){
    c(null, {result:200})
})
const addCollab = jest.fn( function (ticket_id, email, role,c){
    c(null, {result:200})
});
const readdirSync = jest.fn( function (directory_name){
    return "result";
});
const readdirSyncwithFileTypes = jest.fn( function (directory_name, withFileTypes){
    return "result";
});
const readFile = jest.fn( function (directory_name, c){
    c(200, [200] , "application/pdf");
});

const rename = jest.fn( function (ticketID,  file, c){
    c(null);
});
const sendMailInvestigate = jest.fn( function (mailOptions, callback){
    callback(null, null);
});
const app = makeApp({sendMailInvestigate,rename,readFile,readdirSyncwithFileTypes,readdirSync, addCollab,deleteCollab,getPeople,getAllMeetings,sendUpdateEmail, getRole,myHearing,ticketTracker, viewMyOffences, insertOI, updateOI, getEmail})
    

describe("Test Investigation", ()=>{

    test('It should test UploadEvidence (correct number of arg sent)', ()=>{
        const insert = {
            ticket_id : 1,
            file: "avsadv"
        }
        return request(app)
        .post('/UploadEvidence')
        .send(insert, 'abc.js')
        .expect({});
    })
    
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
        .expect(200);
    })
    test('It should test viewTicketFiles (correct number of arg sent)', ()=>{
        return request(app)
        .get('/viewTicketFiles')
        .query({id: 1})
        .query({i: 1})
        .expect(200);
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
    test("It should test sendUpdateEmail (incorrect number of arg sent)", ()=>{
        const insert={
        };
        return request(app)
        .post('/sendUpdateEmail').send(insert)
        .expect({}).then(()=> expect(sendUpdateEmail.mock.calls.length).toBe(0));
    })

    test("It should test sendUpdateEmail (correct number of arg sent)", ()=>{
        const insert={
            ticket_id: "1",
            status: "Guilty",
            stdNo: "1234567"
        };
        return request(app)
        .post('/sendUpdateEmail').send(insert)
        .expect(200).then(()=> expect(sendUpdateEmail.mock.calls.length).toBe(0));
    })
    test('It should test getAllMeetings', ()=>{
        return request(app)
        .get('/getAllMeetings')
        .expect(200).then(()=> expect(getAllMeetings.mock.calls.length).toBe(1));
    })

    test('It should test getRole (incorrect number of arg sent)', ()=>{
        const insert={
            userID: "1234567"
        };
        return request(app)
        .post('/getRole').send(insert)
        .expect(200).then(()=> expect(getRole.mock.calls.length).toBe(0));
    })

    test('It should test getRole (correct number of arg sent)', ()=>{
        const insert={
            userID: "1234567",
            ticketID: "12"
        };
        return request(app)
        .post('/getRole').send(insert)
        .expect(200).then(()=> expect(getRole.mock.calls.length).toBe(1));
    })

    test('It should test addCollab (incorrect number of arg sent)', ()=>{
        const insert={
            email: "leandra@gmail.com"
        };
        return request(app)
        .post('/addCollab').send(insert)
        .expect(200).then(()=> expect(addCollab.mock.calls.length).toBe(0));
    })

    test('It should test addCollab (correct number of arg sent)', ()=>{
        const insert={
            ticket_id:"12", 
            email: "leandra@gmail.com", 
            role:"collaborator"
        };
        return request(app)
        .post('/addCollab').send(insert)
        .expect(200).then(()=> expect(addCollab.mock.calls.length).toBe(1));
    })

    test("Test getPeople (2 arguments => incorrect", ()=>{
        const insert={
            ticket_id: "1",
            email: "leandra@gmail.com"
        }
        return request(app)
        .post('/getPeople').send(insert)
        .expect(200).then(()=> expect(getPeople.mock.calls.length).toBe(0));
    })

    test("Test getPeople (correct)", ()=>{
        const insert={ticket_id: "12"};
        return request(app)
        .post('/getPeople').send(insert)
        .expect(200).then(()=>expect(getPeople.mock.calls.length).toBe(1));
    })

    test("Test deleteCollab (1 argument => incorrect)", ()=>{
        const insert={email: "Leandra@gmail.com"};
        return request(app)
        .post('/deleteCollab').send(insert)
        .expect(200).then(()=> expect(deleteCollab.mock.calls.length).toBe(0));
    })

    test("Test deleteCollab (correct)", ()=>{
        const insert={
            ticket_id: "12",
            email: "leandra@gmail.com"};
        return request(app)
        .post('/deleteCollab').send(insert)
        .expect(200).then(()=>expect(deleteCollab.mock.calls.length).toBe(1));
    })
})