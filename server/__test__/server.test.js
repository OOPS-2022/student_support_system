import makeApp from '../index';
const request = require("supertest");
import { jest } from '@jest/globals'
// const app = makeApp({}); //  !! put db  //require("./server/index"); //server\index.js
// const  database = require( './database.js');

const Login = jest.fn(function (e, p , c){
    if(e && p){
        c(null, {result:1})
    }else{
        c(null, null)
    }
});
const ticketTracker= jest.fn(function (ID, c){
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

const app = makeApp({Login, PossibleOffences, SubmittedOffences, insert,ticketTracker});

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
    test('It should test ticketTracker', ()=>{
        return request(app)
        .get('/ticketTracker')
        .query({ticketID: 1})
        .expect(200).then(()=> expect(ticketTracker.mock.calls.length).toBe(1));
    })
})