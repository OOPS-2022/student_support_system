const request = require("supertest");
import { jest } from '@jest/globals'
import makeApp from '../index';

const getChecklistAns= jest.fn(function (c){
    c(null, 200)
});
const checklistForSession = jest.fn( function (session_id,c){
    c(null, {result:200})
});
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

const app = makeApp({allCheckListQuestions,addCheckListQuestion,viewCheck_id,CheckLists,updateCheckListQuestion,deleteCheckListQuestion,studentChecklistAnswers,addCheckList,getChecklistAns,checklistForSession})


describe("Test Checklist", ()=>{
    test('It should test getChecklistAns', ()=>{
        return request(app)
        .get('/getChecklistAns')
        .expect(200).then(()=> expect(getChecklistAns.mock.calls.length).toBe(1));
    })

    test("It should test checklist for session incorrect nr of args => incorrect", ()=>{
        return request(app)
        .get('/checklistForSession')
        .query({})
        .expect({}).then(()=>expect(checklistForSession.mock.calls.length).toBe(0));
    })

    test('It should test checklistForSession correct nr of arguments => correct', ()=>{
        return request(app)
        .get('/checklistForSession')
        .query({userID: 1})
        .expect(200).then(()=> expect(checklistForSession.mock.calls.length).toBe(1));
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