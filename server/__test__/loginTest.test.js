const request = require("supertest");
import { jest } from '@jest/globals'
import makeApp from '../index';


const Login = jest.fn(function (e, p , c){
    if(e && p){
        c(null, {result:1})
    }else{
        c(null, null)
    }
});

const FetchRole = jest.fn( function (setlgEmail,c){
    c(null, {result:200})
});
const app = makeApp({Login,FetchRole})


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

    test('It should test FetchRole no arguments (incorrect)', ()=>{
        return request(app)
        .post('/FetchRole')
        .expect(200).then(()=> expect(FetchRole.mock.calls.length).toBe(0));
    })

    test('It should test FetchRole (correct)', ()=>{
        const insert={setlgEmail: "test@gmail.com"};
        return request(app)
        .post('/FetchRole').send(insert)
        .expect(200).then(()=> expect(FetchRole.mock.calls.length).toBe(1));
    })

});

