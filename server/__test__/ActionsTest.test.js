const request = require("supertest");
import { jest } from '@jest/globals'
import makeApp from '../index';


const myActions = jest.fn( function (userID,c){
    c(null, {result:200})
});
const viewAction = jest.fn( function (actionID,c){
    c(null, {result:200})
});

const app = makeApp({viewAction,myActions})

describe("Test Actions", ()=>{
    test('It should test myActions', ()=>{
        return request(app)
        .get('/myActions')
        .query({userID: 1})
        .expect(200).then(()=> expect(myActions.mock.calls.length).toBe(1));
    })

    test('It should test viewAction', ()=>{
        const insert={actionID: 1};
        return request(app)
        .post('/viewAction').send(insert)
        .expect(200).then(()=> expect(viewAction.mock.calls.length).toBe(1));
    })
})