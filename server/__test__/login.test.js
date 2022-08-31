import makeApp from '../index';
const request = require("supertest");
import { jest } from '@jest/globals'
// const app = makeApp({}); //  !! put db  //require("./server/index"); //server\index.js
const  database = require( './database.js');


const Login = jest.fn();
const PossibleOffences = jest.fn();


const app = makeApp({
    Login,PossibleOffences
})

describe("Test login", ()=>{

    test("Status when both given",()=>{
        const login={
            setlgEmail: "test@gmail.com",
            setlgPassword: "test"
        };
        request(app)
        .post("/Login")
        .send(login)
        expect(200);
        
    });

    test("Status when email not given",()=>{
        const login={
            setlgPassword: "test"
        };
        return request(app)
        .post("/Login")
        .send(login)
        .expect({});
    });

    test("Status when password not given",()=>{
        const login={
            setlgEmail: "test@gmail.com"
        };
        return request(app)
        .post("/Login")
        .send(login)
        .expect({});
    });

});

describe("Test possible offences", ()=>{
    test("test get possible offences", ()=>{
        return request(app)
        .get('/PossibleOffences')
        .expect(200)
    });
});

// describe("Test submitted offences", ()=>{
//     test("Get method for sumitted offences", ()=>{
//         return request(app)
//         .get('/SubmittedOffences')
//         .expect(200)
//     })
// })

// describe("Test offences", ()=>{
//     test("It should test get offences", ()=>{
//         return request(app)
//         .get('/offences')
//         .expect(200)
//     })
// })

// describe("Test Selected Offence", ()=>{
//     test('It should test get selected offence', ()=>{
//         request(app)
//         .get('/SelectedOffence')
//         .query({ticket_id: 1})
//         .expect(200)
//     })
// })

// describe("Test view pledges", ()=>{
//     test('It should return pledges', ()=>{
//         return request(app)
//         .get('/viewPledges')
//         .expect(200)
//     })
// })

// describe("Test getting file number", ()=>{
//     test('It should return number of files', ()=>{
//         return request(app)
//         .get('/viewPledges')
//         .query({ticket_id: 1})
//         .expect(200)
//     })
// })