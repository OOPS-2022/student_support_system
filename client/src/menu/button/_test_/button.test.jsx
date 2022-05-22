/**
 * @jest-environment jsdom
 */

import React from 'react';
import ReactDOM from 'react-dom';
import {isTSAnyKeyword} from "@babel/types";
import Btn from '../button';


test('use jsdom in this test file', () => {
    const element = document.createElement('div');
    ReactDOM.render(<Btn></Btn>,element);
  });