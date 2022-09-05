import React from "react";
import "./header.css";
import Image from "../image/image";
import logo from "../wits_logo.png";
import "./BULGARE.otf";


function Header(props){
    return(
        <>
        <div className="header">
            <h1 style={{color: "white", paddingLeft: "25px", fontFamily:"BULGARE"}}>{props.name}</h1>
        </div>
        </>
    );
}

export default Header;