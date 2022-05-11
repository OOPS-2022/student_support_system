import React, { Component, useState } from "react";
import "./menu.css";
import Btn from "./button/button";
import { Stack } from "@mui/material";
import { Button } from "@mui/material";
import LogOffence from "./logOffence/logOffence";
import App from "../website";
import ReactDOM from "react-dom";
import CustomTable from "./table/table";
import Welcome from "./welcome/welcome";
import { useNavigate } from "react-router-dom";
import { alignProperty } from "@mui/material/styles/cssUtils";



export default function Menu(props) {
     
     let navigate = useNavigate();
     const about = () => navigate("/About");
     const logBut = () => navigate("/LogOffence");
     const possBut = () => navigate("/PossibleOffences");
     const subBut = () => navigate("/SubmittedOffences");
     const pledgeBut = () => navigate("/Pledge");
     const testBut = () => navigate("/CreateTest");
     const doBut = () => navigate("/DoTest");
     const myBut = () => navigate("/MyOffences");
   
  
return (
        <div className="menuWrapper" >
            <h1 sx={{fontFamily:"Arial, Helvetica, sans-serif",color: "black",fontSize:"30px"}}>Menu</h1>
            <Stack direction="column" spacing={2}>
              <Btn action={about} description="About"/>
              {(localStorage.getItem("user_role") != "admin"  &&   (localStorage.getItem("logged_id" )))  &&(<Btn action={logBut} description="Log Offence"/>)}
              {(localStorage.getItem("user_role") == "admin" &&   (localStorage.getItem("logged_id" )))   &&( <Btn action={possBut} description="Manage Offences" />)}
              {(localStorage.getItem("user_role") == "admin"&&   (localStorage.getItem("logged_id" )))   &&( <Btn action ={subBut} description ="Submitted Offences" />)}
              {(localStorage.getItem("user_role") == "admin"&&   (localStorage.getItem("logged_id" )))  &&(<Btn action = {pledgeBut} description="Manage Pledges" />)}
              {(localStorage.getItem("user_role") == "admin" &&(localStorage.getItem("logged_id" )))  &&( <Btn action = {testBut} description="Create Test"/>)}
              {(localStorage.getItem("user_role") != "admin" &&(localStorage.getItem("logged_id" )))   &&(<Btn action = {doBut} description="Do Test"/>)}
              {(localStorage.getItem("user_role") != "admin" &&(localStorage.getItem("logged_id" )))   &&(<Btn action = {myBut} description="My Offences"/>)}
            </Stack>
        </div>


    );
}

 