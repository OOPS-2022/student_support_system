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

//unit test to test if the button function is rendered properly
test('use jsdom in this test file', () => {
    render(<Btn></Btn>);
});


//unit test to test if the button function is executed on click
test('click', () => {
    render(<Btn />);

    const button = screen.getByRole('button');
    userEvent.click(button);

})

test('test with props', () => {
    render(<Btn description = "button"></Btn>);
    const button = screen.getByRole('button', {name: 'button'})
    userEvent.click(button);

});


