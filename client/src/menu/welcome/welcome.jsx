import React from "react";
import "../page.css"
import Btn from "../button/button";
import "./welcome.css"
import witsImage from "./0000974889_resized_witsuniversity1022.jpg"



function Welcome(){
    return(
        <div className="welcome" >
            <h1 className="stack-top" style ={{marginLeft: "800px",backgroundColor:"rgb(255,255,255)"}}>Welcome to the WITS Student Support Centre.</h1>
            <img className ="box" style ={{width: "1200px"}}src={witsImage}></img>
        </div>

    );

}

export default Welcome ;