/**
 * @jest-environment jsdom
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import {isTSAnyKeyword} from "@babel/types";
import Btn from '../button';


test('use jsdom in this test file', () => {
    const element = document.createElement('div');
     let root = ReactDOM.createRoot(element)
     root.render(<Btn></Btn>);
  });

  