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
     const mySess = () => navigate("/MySessions");
     const sess = () => navigate("/Sessions");
     const checkList = () => navigate("/checkList");
   
  
return (
        <div className="menuWrapper" >
            <h1 sx={{fontFamily:"Arial, Helvetica, sans-serif",color: "black",fontSize:"30px"}}>Menu</h1>
            <Stack direction="column" spacing={2}>
              <Btn action={about} description="About"/>
              {(sessionStorage.getItem("user_role") == "admin"  &&   (sessionStorage.getItem("logged_id" )))  &&(<Btn action={sess} description="Sessions"/>)}
              {(sessionStorage.getItem("user_role") != "admin"  &&   (sessionStorage.getItem("logged_id" )))  &&(<Btn action={mySess} description="My Sessions"/>)}
              {(sessionStorage.getItem("user_role") != "admin"  &&   (sessionStorage.getItem("logged_id" )))  &&(<Btn action={logBut} description="Log Offence"/>)}
              {(sessionStorage.getItem("user_role") == "admin" &&   (sessionStorage.getItem("logged_id" )))   &&( <Btn action={possBut} description="Manage Offences" />)}
              {(sessionStorage.getItem("user_role") == "admin"&&   (sessionStorage.getItem("logged_id" )))   &&( <Btn action ={subBut} description ="Submitted Offences" />)}
              {(sessionStorage.getItem("user_role") == "admin"&&   (sessionStorage.getItem("logged_id" )))  &&(<Btn action = {pledgeBut} description="Manage Pledges" />)}
              {(sessionStorage.getItem("user_role") == "admin" &&(sessionStorage.getItem("logged_id" )))  &&( <Btn action = {testBut} description="Create Test"/>)}
              {(sessionStorage.getItem("user_role") != "admin" &&(sessionStorage.getItem("logged_id" )))   &&(<Btn action = {doBut} description="Do Test"/>)}
              {(sessionStorage.getItem("user_role") != "admin" &&(sessionStorage.getItem("logged_id" )))   &&(<Btn action = {myBut} description="My Offences"/>)}
              {(sessionStorage.getItem("user_role") == "admin" &&(sessionStorage.getItem("logged_id" )))  &&( <Btn action = {checkList} description="Check List"/>)}
            </Stack>
        </div>


    );
}

 