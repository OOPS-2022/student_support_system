const request = require("supertest");
import { jest } from '@jest/globals'
import makeApp from '../index';

const createSchedule=jest.fn(function(userID, startDate, endDate, c){
    c(null, {result: 200});
})

const timeTableEntry=jest.fn(function(scheduleID, day, time, desc, c){
    c(null, {result: 200})
})

const changeTimeTableEntry=jest.fn(function(scheduleID, day, time, desc, c){
    c(null, {result: 200})
})

const getScheduleID=jest.fn(function(userID, c){
    c(null, {result: 200})
})

const scheduleNotification=jest.fn(function(userID, scheduleID, c){
    c(null, {result: 200})
})

const app= makeApp({createSchedule, timeTableEntry, changeTimeTableEntry, getScheduleID, scheduleNotification})

describe("Testing the creation of a schedule", ()=>{
    test("create pledge with too few arguments => incorrect", ()=>{
        const insert={userID: 1, startDate: '2022-10-10'};
        return request(app)
        .post('/createSchedule').send(insert)
        .expect({}).then(()=> expect(createSchedule.mock.calls.length).toBe(0));
    })

    test("create pledge with correct nr of arguments => correct", ()=>{
        const insert={userID: "1", startDate: '2022-10-10', endDate: '2022-12-12'};
        return request(app)
        .post('/createSchedule').send(insert)
        //.expect(response=>{console.log(response)})
        .expect(200).then(()=> expect(createSchedule.mock.calls.length).toBe(1))
    })
})

describe("Testing enter time table entry", ()=>{
    test("add time table entry incorrect number of arguments => incorrect", ()=>{
        const insert={scheduleID: 1, day: 1};
        return request(app)
        .post('/timeTableEntry').send(insert)
        .expect({}).then(()=> expect(timeTableEntry.mock.calls.length).toBe(0));
    })

    test("add time table entry correct arguments => correct", ()=>{
        const insert={scheduleID: 1, day: 1, time: '09:00', desc: "test"};
        return request(app)
        .post('/timeTableEntry').send(insert)
        .expect(200).then(()=> expect(timeTableEntry.mock.calls.length).toBe(1))
    })
})

describe("Testing update time table entry", ()=>{
    test("update time table entry incorrect number of arguments => incorrect", ()=>{
        const insert={scheduleID: 1, day: 1, desc: "update"};
        return request(app)
        .post('/changeTimeTableEntry').send(insert)
        .expect({}).then(()=> expect(changeTimeTableEntry.mock.calls.length).toBe(0));
    })

    test("update time table entry correct arguments => correct", ()=>{
        const insert={scheduleID: 1, day: 1, time: '09:00', desc: "update"};
        return request(app)
        .post('/changeTimeTableEntry').send(insert)
        .expect(200).then(()=> expect(changeTimeTableEntry.mock.calls.length).toBe(1))
    })
})

describe("tests getting schedule information", ()=>{
    test("test getScheduleID with incorrect number of arguments => incorrect", ()=>{
        const insert={};
        return request(app)
        .post('/getScheduleID').send(insert)
        .expect({}).then(()=> expect(getScheduleID.mock.calls.length).toBe(0));
    })

    test("test getScheduleID with correct number of arguments => correct", ()=>{
        const insert={userID: 1};
        return request(app)
        .post('/getScheduleID').send(insert)
        .expect(200).then(()=> expect(getScheduleID.mock.calls.length).toBe(1));
    })
})

describe("Test schedule notification", ()=>{
    test("test scheduleNotification with incorrect nr of arguments => incorrect", ()=>{
        const insert={userID: 1};
        return request(app)
        .post('/scheduleNotification').send(insert)
        .expect({}).then(()=> expect(scheduleNotification.mock.calls.length).toBe(0));
    })

    test("test scheduleNotification with correct nr of arguments => correct", ()=>{
        const insert={userID: 1, scheduleID: 1};
        return request(app)
        .post('/scheduleNotification').send(insert)
        .expect(200).then(()=> expect(scheduleNotification.mock.calls.length).toBe(1));
    })
})