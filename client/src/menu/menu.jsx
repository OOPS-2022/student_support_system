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
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import witsImage from "./channels4_profile.jpg"



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
  const checkedBut = () => navigate("/CheckedSessions");
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };


  return (
    <div className="menuWrapper" >

        <Accordion style={{backgroundColor: "rgb(21,30,166)", color: "white"}} expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
          <AccordionSummary
            expandIcon={<MenuIcon  style={{ color:"white"}}/>}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <h1 style = {{fontFamily: "BULGARE", paddingLeft: "10%"}}>MAIN MENU</h1>
          </AccordionSummary>

          <AccordionDetails>
          {(sessionStorage.getItem("user_role") != "admin"  &&   (sessionStorage.getItem("logged_id" )))  &&(<Btn action={logBut} description="Log Offence"/>)}
          
           {(sessionStorage.getItem("user_role") != "admin"  &&   (sessionStorage.getItem("logged_id" )))  &&(<Btn action={mySess} description="My Sessions"/>)}
           {(sessionStorage.getItem("user_role") != "admin" &&(sessionStorage.getItem("logged_id" )))   &&(<Btn action = {myBut} description="My Offences"/>)}
          {(sessionStorage.getItem("user_role") == "admin"  &&   (sessionStorage.getItem("logged_id" )))  && (<Accordion style ={{backgroundColor:"rgb(21,30,166)", boxShadow: 0 }}>
              <AccordionSummary>
              <h1 style = {{ fontSize: "medium", color:"white"}}>Sessions</h1>
              </AccordionSummary>
              <AccordionDetails>
              <Btn style = {{fontFamily: "BULGARE"}} action={sess} description="Manage Sessions"/>
              <Btn action={checkedBut} description="Session Report" />
              {(sessionStorage.getItem("user_role") == "admin"&&   (sessionStorage.getItem("logged_id" )))  &&(<Btn action = {pledgeBut} description="Manage Pledges" />)}
              
              </AccordionDetails>
              </Accordion>)}

              {(sessionStorage.getItem("user_role") == "admin"  &&   (sessionStorage.getItem("logged_id" )))  && (<Accordion style ={{backgroundColor:"rgb(21,30,166)", boxShadow: 0 }}>
              <AccordionSummary>
              <h1 style = {{ fontSize: "medium", color:"white"}}>Offences</h1>
              </AccordionSummary>
              <AccordionDetails>
              
              <Btn action={possBut} description="Manage Offences" />
              <Btn action ={subBut} description ="Logged Offences" />
              
              </AccordionDetails>
            
              </Accordion>)}
              
             
              
             
              
  
              
              {(sessionStorage.getItem("user_role") == "admin" &&(sessionStorage.getItem("logged_id" )))  && (<Accordion style ={{backgroundColor:"rgb(21,30,166)", boxShadow: 0 }}>
              <AccordionSummary>
              <h1 style = {{ fontSize: "medium", color:"white"}}>Check List</h1>
              </AccordionSummary>
              <AccordionDetails>
              <Btn action = {checkList} description="Add Check List"/>
              </AccordionDetails>
              </Accordion> )}
          </AccordionDetails>
        </Accordion>
        <Accordion style={{backgroundColor: "rgb(21,30,166)", color: "white"}} expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
          <AccordionSummary
            // expandIcon={<MenuIcon  style={{ color:"white"}}/>}
            aria-controls="panel2bh-content"
            id="header2"
          >
            <h1 style = {{fontFamily: "BULGARE", fontSize: "medium" ,paddingLeft: "25%"}}>ABOUT</h1>
          </AccordionSummary>

          <AccordionDetails>
          </AccordionDetails>
          </Accordion>
          <Accordion style={{backgroundColor: "rgb(21,30,166)", color: "white"}} expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
          <AccordionSummary
            // expandIcon={<MenuIcon  style={{ color:"white"}}/>}
            aria-controls="panel4bh-content"
            id="header4"
          >
            <h1 style = {{fontFamily: "BULGARE", fontSize: "medium" ,paddingLeft: "25%"}}>ACCOUNT</h1>
          </AccordionSummary>

          <AccordionDetails>
            <p1>Change account details...</p1>
          </AccordionDetails>
          </Accordion>
          <Accordion style={{backgroundColor: "rgb(21,30,166)", color: "white"}} expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
          <AccordionSummary
            // expandIcon={<MenuIcon  style={{ color:"white"}}/>}
            aria-controls="panel3bh-content"
            id="header3"
          >
            <h1 style = {{fontFamily: "BULGARE", fontSize: "medium" ,paddingLeft: "25%"}}>CONTACT WITS</h1>
          </AccordionSummary>

          <AccordionDetails>
            <p1>Contact wits at ...</p1>
          </AccordionDetails>
          </Accordion>
          <Accordion>
          <AccordionSummary
           
          >
           <img  style ={{width:"100%", height:"200%"}}alt ="" src ={witsImage}></img>
          </AccordionSummary>

          </Accordion>

    </div>


  );
}

