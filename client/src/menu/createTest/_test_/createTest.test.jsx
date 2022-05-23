/**
 * @jest-environment jsdom
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { isTSAnyKeyword } from "@babel/types";
import CreateTest, { getData } from '../createTest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {screen} from '@testing-library/dom'
import axios from 'axios';
import { createTest } from '../createTest.jsx';
import  { itTSAnyKeyword } from "@babel/types";
import 'regenerator-runtime/runtime';
import {useEffect} from "react";


//unit test to test if the CreateTest function gets rendered
test('use jsdom in this test file', () => {
  render(<CreateTest></CreateTest>);

});


test('click', () => {
  render(<CreateTest />);
  const button = screen.queryByTestId('buttonCreateTest');
  userEvent.click(button);

});

// test('input',()=>{

//   render(<CreateTest />);
//   userEvent.type(  screen.getByRole('input1'), 'Hello World')


// })
jest.mock("../createTest");

test("mockName", () => {
  const mockFn = jest.fn().mockName("getData");
  mockFn(); // comment me
  expect(mockFn).toHaveBeenCalled();
});


jest.mock('axios');


// ...

test("good response", () => {
  axios.post.mockImplementation(() => Promise.resolve({ data: {testName : "Test70",
            pledgeID: 4,
            courseCode: "MATH2525",
            testDate:"01-01-2022",
            creatorID: 4} }));
});

test("bad response", () => {
  axios.post.mockImplementation(() => Promise.reject({ testName : "Test70",
            pledgeID: 4,
            courseCode: "MATH2525",
            testDate:"01-01-2022",
            creatorID: 4}));

});



// Types HelloWorld in a text field
