const request = require("supertest");
import { jest } from '@jest/globals'
import makeApp from '../index';

const LogOffenceNoFile= jest.fn(function (offenderName, offenceID, offenceDetails, offenceCode, offenceStatus, submittedBy,offenceType,offenceOther, c){
    c(null, "200")
});
const LogOffence= jest.fn(function (offenderName, offenceID, offenceDetails, offenceCode, offenceStatus, submittedBy,offenceType,offenceOther, c){
    c(null, "test")
});
const fetchOffenderEmail= jest.fn(function (offenderName, c){
    c(null, "200")
});

const mkdir= jest.fn(function (dir, c){
    c(null)
});
const rename = jest.fn( function (ticketID,  file, c){
    c(null);
});
const sendMail = jest.fn( function (offenderEmail,offenceType){
    return 1;
});
const app = makeApp({sendMail,mkdir,rename,fetchOffenderEmail,LogOffenceNoFile,LogOffence})

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


})