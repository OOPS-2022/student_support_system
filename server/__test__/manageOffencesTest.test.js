const request = require("supertest");
import { jest } from '@jest/globals'
import makeApp from '../index';

const PossibleOffences = jest.fn(function (c){
    c(null, {result:200})
});
const AllSubmittedOffences = jest.fn(function (c){
    c(null, {result:200})
});
const SubmittedOffences = jest.fn( function (user_id,c){
    c(null, {result:200})
});
const update = jest.fn( function (offenceName, severity, desc, offenceId,c){
    c(null, {result:200})
});

const selectOffence = jest.fn( function (ticket_id,c){
    c(null, {result:200})
});

const deleteOffence = jest.fn( function (offenceId,c){
    c(null, {result:200})
});
const insert = jest.fn( function (n, s , d,c){
    c(null, {result:200})
});


const app = makeApp({insert,deleteOffence,selectOffence,update,PossibleOffences,AllSubmittedOffences, SubmittedOffences})

describe("Test Manage Offences", ()=>{
    test('It should test selectOffence', ()=>{
        return request(app)
        .get('/selectOffence')
        .query({ticket_id: 1})
        .expect(200).then(()=> expect(selectOffence.mock.calls.length).toBe(1));
    })

    test('It should test deleteOffence', ()=>{
        const insert={offenceId: 1};
        return request(app)
        .post('/delete').send(insert)
        .expect(200).then(()=> expect(deleteOffence.mock.calls.length).toBe(1));
    })

    test('It should test update Offence', ()=>{
        const insert={
            offenceName: "test",
            severity: 1,
            desc: "This is a test",
            offenceId: 1};
        return request(app)
        .post('/update').send(insert)
        .expect(200).then(()=> expect(update.mock.calls.length).toBe(1));
    })
    test("test get possible offences", ()=>{
        return request(app)
        .get('/PossibleOffences')
        .expect(200).then(()=> expect(PossibleOffences.mock.calls.length).toBe(1));
    });
    test("test get offences", ()=>{
        return request(app)
        .get('/offences')
        .expect(200).then(()=> expect(PossibleOffences.mock.calls.length).toBe(2));
    });
    test("Get method for all sumitted offences", ()=>{
        return request(app)
        .post('/AllSubmittedOffences')
        .expect(200).then(()=> expect(AllSubmittedOffences.mock.calls.length).toBe(1));
    })

    test('It should test SubmittedOffences (incorrect number of arg sent)', ()=>{
        const insert={};

        return request(app)
        .post('/SubmittedOffences').send(insert)
        .expect(200).then(()=> expect(SubmittedOffences.mock.calls.length).toBe(0));
    })
    test('It should test SubmittedOffences (correct number of arg sent)', ()=>{
        
        const insert={user_id: "12"};

        return request(app)
        .post('/SubmittedOffences').send(insert)
        .expect(200).then(()=> expect(SubmittedOffences.mock.calls.length).toBe(1));
    })

    test("insert offences incorrect arguments sent", ()=>{
        const insertOf={
            offenceName: "Fabien",
        };
        return request(app)
        .post('/insert').send(insertOf)
        .expect({}).then(()=> expect(insert.mock.calls.length).toBe(0));
    })

    test("insert offences correct arguments sent", ()=>{
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
