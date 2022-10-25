const request = require("supertest");
import { jest } from '@jest/globals'
import makeApp from '../index';

const viewPledges = jest.fn( function (c){
    c(null, {result:200})
});

const viewFile = jest.fn( function (id,c){
    c(null, [{pledge_link:"link"}])
});

const pledgeType = jest.fn( function (testID,c){
    c(null, {result:200})
});
const createClickedPledge= jest.fn(function (name, desc, pledge_type ,sessions,c){
    c(null, 200)
});

const createSignedPledge=jest.fn(function(name, desc, type, saveLink, sessions, c){
    c(null, 200)
});
const mkdir= jest.fn(function (dir, c){
    c(null)
});
const renamePledgeFile = jest.fn( function (file, c){
    c("link");
});
const readFile = jest.fn( function (directory_name, c){
    c(200, [200] , "application/pdf");
});

const app = makeApp({readFile,renamePledgeFile,mkdir,createSignedPledge, createClickedPledge,viewPledges,pledgeType,viewFile})

describe("Test pledges", ()=>{
    test('It should test viewPledges', ()=>{
        return request(app)
        .get('/viewPledges')
        .expect(200).then(()=> expect(viewPledges.mock.calls.length).toBe(1));
    })

    test('It should test pledgeType', ()=>{
        return request(app)
        .get('/pledgeType')
        .query({testID: 1})
        .expect(200).then(()=> expect(pledgeType.mock.calls.length).toBe(1));
    })

    test('It should test viewFile', ()=>{
        return request(app)
        .get('/viewFile')
        .query({id: 1})
        .expect(200).then(()=> expect(viewFile.mock.calls.length).toBe(1));
    })

    test('It should test createClickedPledge', ()=>{
        const insert = {
            name: "test",
            desc: "test",
            sessions: "test"
        }
        return request(app)
        .post('/createClickedPledge').send(insert)
        .expect(200).then(()=> expect(createClickedPledge.mock.calls.length).toBe(1));
    })

    test("It should test createSignedPledge", ()=>{
        const insert = {
            name: "test",
            desc: "test",
            sessions: "test"
        }
        return request(app)
        .post('/createSignedPledge').send(insert)
        .expect(200).then(()=> expect(createSignedPledge.mock.calls.length).toBe(1));
    })
})