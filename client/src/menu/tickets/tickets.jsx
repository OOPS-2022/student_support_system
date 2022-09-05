import React from "react";
import "../page.css";
import "./tickets.css"
import { MenuItem, TextField, Button, Card, CardActionArea, CardMedia, CardContent, Typography, CardActions } from "@mui/material";
import Axios from 'axios';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Label from "../label";
import { Document, Page } from "react-pdf";
import samplePDF from './sample.pdf';
import { pdfjs } from "react-pdf";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SpecialCard from "./card";



export default function Ticket() {
    const [status, setStatus] = React.useState("");
    const [desc, setDesc] = React.useState("");
    const [crsCode, setCrsCode] = React.useState();
    const [studentNumber, setStudentNumber] = React.useState();
    const [pdfString, setPdfString] = useState('');
    const [ticket_id, setID] = useState("");
    const [fileNum, setFileNum] = useState(0);
    const [files, setFiles] = useState([]);
    let navigate = useNavigate();


    const getTicket = async () => {
        const response = await Axios.get('http://localhost:3001/selectOffence', {
            params: { 'ticket_id': sessionStorage.getItem("ticket_id") }
        });
        console.log(response.data["offence_status"]);
        setStatus(response.data["offence_status"]);
        setDesc(response.data["details"]);
        setCrsCode(response.data["crs_code"]);
        setStudentNumber(response.data["offender_name"]);
        setID(response.data["ticket_id"]);
        sessionStorage.setItem("studentNumber", response.data["offender_name"]);
    }


   


    
    getTicket();
    


    useEffect(() => {
    const getFiles = async () => {
        const response = await Axios('http://localhost:3001/fileNumber', {
            method: 'GET',
            params: { 'ticket_id': sessionStorage.getItem("ticket_id") } //hardcoded for now
        });
        for (let i = 0; i < Number(response.data); i++) {
            const response = await Axios.get('http://localhost:3001/viewTicketFiles', {
                responseType: 'blob', //Force to receive data in a Blob Format
                params: { 'id': sessionStorage.getItem("ticket_id"), "i": i }
            });
                // Create a Blob from the PDF Stream
                const file = new Blob(
                    [response.data],
                    { type: 'application/pdf' });
                setFiles(OldArray => [...OldArray, file]);

                //Open the URL on new Window

            }
    }
    getFiles();
}, []);
     



    console.log("files:" + files[0]);
    const oiMenu = () => navigate("/OIMenu");
   

    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
    return (

        <div className="pageWrapper">

            <h1>Ticket {sessionStorage.getItem("ticket_id")}</h1>
            <h1> Student: {studentNumber}</h1>
            <div className="ticketForm">
                <div>
                    <Button variant="contained" onClick={oiMenu} >Investigate</Button>
                </div>
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
                <label>Evidence:</label>
                {files.map((file) => ( 
                <Card >
                    <CardActionArea >
                        <Document file={file}>
                            <Page height={500} pageNumber={1} />
                        </Document>
                    </CardActionArea>
                    {/* <CardActions>
                        <Button size="small" color="primary">
                            OPEN
                        </Button>
                    </CardActions> */}
                </Card>
                 ))}
                           </div>

        </div>




    );

}

