import React from 'react';
import './button.css';


function Button(props) {
    const isDisabled = props?.disabled ?? false;
    return (
        <button onClick={() => props?.action()} className="custom-button" style={props?.style} disabled={isDisabled}>{props.buttonText}</button>
    )
}

export default Button;