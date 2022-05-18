import React from "react";
import "./header.css";
import Image from "../image/image";
import logo from "../wits_logo.png";


function Header(props){
    return(
        <div className="header">
            < Image Image={logo}/>
            <h1 className="font-face-gm">{props.name}</h1>
        </div>
    );
}

export default Header;