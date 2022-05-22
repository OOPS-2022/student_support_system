/**
 * @jest-environment jsdom
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Button from "../button";
import {isTSAnyKeyword} from "@babel/types";


test('use jsdom in this test file', () => {
    const element = document.createElement('div');
    expect(<Button></Button>).not.toBeNull();
  });