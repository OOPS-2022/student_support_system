import React from 'react';
import './button.css';


function Button(props) {
    const isDisabled = props?.disabled ?? false;
    return (
        <button className="custom-button" onClick = {props?.click} style={props?.style} disabled={isDisabled}>{props.buttonText}</button>
    )
}

export default Button;