
import {index} from './../index.js'
import 'given2/setup';
import given from 'given2';
//import { it } from 'date-fns/locale';
//import { Experimental_CssVarsProvider } from '@mui/material';
import 'regenerator-runtime/runtime';

import request from 'supertest';
import express from 'express';

// describe('Login', function(){
//     given('details',()=> Login.details({
//         setglEmail: given.email,
//         setlgPassword: given.password
//     }))

//     it('should return "logged in"', ()=>{
//         given('email',()=> 'test@gmail.com')
//         given('password',()=> 'test')
//         expect(given.details).toBe('logged in') 
//     })

//     it('should return "incorrect"', ()=>{
//         given('email',()=>'tester@gmail.com')
//         given('password',()=> 'test')
//         expect(given.details).toBe('incorrect')
//     })
// })

const app = new express();
app.use(index)

// describe('Test Handlers', function () {

//     test('responds to /Login', async () => {
//       const res = await request(app).post('/Login');
//       expect(res.header['content-type']).toBe('text/html; charset=utf-8');
//       expect(res.statusCode).toBe(200);
//       expect(res.text).toEqual('hello world!');
//     });
    
//     test('responds to /hello/:name', async () => {
//       const res = await request(app).get('/hello/jaxnode'); 
//       expect(res.header['content-type']).toBe('text/html; charset=utf-8');
//       expect(res.statusCode).toBe(200);
//       expect(res.text).toEqual('hello jaxnode!');
//     });
  
//     test('responds to /hello/Annie', async () => {
//       const res = await request(app).get('/hello/Annie'); 
//       expect(res.header['content-type']).toBe('text/html; charset=utf-8');
//       expect(res.statusCode).toBe(200);
//       expect(res.text).toEqual('hello Annie!');
//     });
  
//   });