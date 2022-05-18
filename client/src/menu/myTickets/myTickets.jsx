import React from "react";
import "../page.css";
import Paper from '@mui/material/Paper';

import { MenuItem, TextField, Button, Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, TableContainer, Table, TableHead, TableRow, tableCellClasses, TableCell, TableBody, Modal, Stack, Tabs, Tab } from "@mui/material";

import { Document, Page } from "react-pdf";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./myTicket.css"
import Axios from "axios";
import {  } from "@mui/material";
import styled from "@emotion/styled";
import { maxHeight } from "@mui/system";
import { sizing } from '@mui/system';



const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "rgba(6, 71, 150, 0.6)",
  
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: "rgb(231,206,140,0.4)",
  
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
    "&:hover": {
      backgroundColor: "rgba(6, 71, 150, 0.2) !important"
    },
  }));
  

export default function MyTickets() {
    const [status, setStatus] = React.useState("");
    const [desc, setDesc] = React.useState("");
    const [crsCode, setCrsCode] = React.useState("");
    const [record, setRecord] = React.useState([]);
    const [meetings, setMeetings] = React.useState([]);


    useEffect(() => {
        Axios.get("http://localhost:3001/selectOffence", {
           params: { 'ticket_id': localStorage.getItem("ticket_id_student") }
       }).then((res) => {
        setStatus(res.data["offence_status"]);
        setDesc(res.data["details"]);
        setCrsCode(res.data["crs_code"]);
       }
      )

   },[]
   );

   useEffect(() => {
    Axios.get("http://localhost:3001/ticketTracker", {
       params: { 'ticketID': localStorage.getItem("ticket_id_student") }
   }).then((res) => {
   setRecord(res.data);
   }
  )

},[]
);

    useEffect(() => {
        Axios.get("http://localhost:3001/myHearing", {
           params: { 'ticket_id': localStorage.getItem("ticket_id_student") }
       }).then((res) => {
       console.log(res.data);
       setMeetings(res.data);
       }
      )

   },[]
   );
    const meetingsHeaders = ["Meeting date","Meeting Link", "Send help to SRC"];
    const recordHeaders = ["Update","Date"];
    
    console.log(meetings);

    return (

        <div className="pageWrapper">
            <h1>Ticket {localStorage.getItem("ticket_id_student")}</h1>
            <div className="ticketForm">

                <div>
                    <label>Status: </label>
                    <label>{status}</label>

                </div>
                <div>
                    <label>Description: </label>
                    <label>{desc}</label>

                </div>
                <div>
                    <label>Course code: </label>
                    <label>{crsCode}</label>

                </div>

                <div className="flex-container">
        <div className="flex-child">
                <TableContainer component={Paper}  id="cT">
                    <Table   sx={{ minWidth: 500 }} aria-label="customized table"  >
                        <TableHead >
                            <TableRow >
                                {meetingsHeaders.map((headerItem, index) => (
                         
                                    <StyledTableCell key={index}>{headerItem}</StyledTableCell>
                                    
                                    
                                ))}
                                
                            </TableRow>

                        </TableHead>
                        <TableBody>
                            {Object.values(meetings).map((obj, index) => (
                                <StyledTableRow key={index} >
                                    <StyledTableCell >{obj["meetDate"]}</StyledTableCell>
                                    <StyledTableCell >{obj["meetLink"]}</StyledTableCell>
                                    <Button variant="text" sx={{ marginLeft: "10px", marginRight: "150px" }}>EMAIL</Button>
                                </StyledTableRow>
                            ))}
                            
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <div className="flex-child">
                <TableContainer component={Paper}  id="cT">
                    <Table sx={{ minWidth: 500 }} aria-label="customized table"  >
                        <TableHead>
                            <TableRow >
                                {recordHeaders.map((headerItem, index) => (
                         
                                    <StyledTableCell key={index}>{headerItem}</StyledTableCell>
                                    
                                    
                                ))}
                                
                            </TableRow>

                        </TableHead>
                        <TableBody>
                            {Object.values(record).map((obj, index) => (
                                <StyledTableRow key={index} >
                                    <StyledTableCell >{obj["description"]}</StyledTableCell>
                                    <StyledTableCell >{obj["date"]}</StyledTableCell>
                    
                                </StyledTableRow>
                            ))}
                            
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            </div>
            </div>
        </div>




    );
}


