/**
 * @jest-environment jsdom
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import Btn from '../button';
import { isTSAnyKeyword } from "@babel/types";
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { screen, configure } from '@testing-library/react'


test('use jsdom in this test file', () => {
    const element = document.createElement('div');
    let root = ReactDOM.createRoot(element);
    root.render(<Btn></Btn>);
});

test('click', () => {
    render(<Btn />);

    const button = screen.getByRole('button');
    userEvent.click(button);

})


