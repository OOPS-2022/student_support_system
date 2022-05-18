import React from "react";
import "../page.css";
import "./tickets.css"
import { MenuItem, TextField, Button, Card, CardActionArea, CardMedia, CardContent, Typography, CardActions } from "@mui/material";
import Axios from 'axios';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Label from "../label";
import { Document,Page } from "react-pdf";
import samplePDF from './sample.pdf';
import { pdfjs } from "react-pdf";
import { useNavigate } from "react-router-dom";
import { useState ,useEffect} from "react";
import SpecialCard from "./card";



export default function Ticket(){
    const [status, setStatus] = React.useState("");
    const [desc, setDesc] = React.useState("");
    const [crsCode, setCrsCode] = React.useState();
    const [studentNumber, setStudentNumber] = React.useState();

    const [ticket_id, setID]=useState("");
    const [fileNum, setFileNUm]=useState(0);
    const card = [];
    let file = "";
    let fileURL = "";
    let files = [];
    let navigate = useNavigate();
    

    const getTicket = async () =>{ 
        const response = await Axios.get('http://localhost:3001/selectOffence',{
            params: { 'ticket_id': localStorage.getItem("ticket_id") }
          });
          
          setStatus(response.data["offence_status"]);
          setDesc(response.data["details"]);
          setCrsCode(response.data["crs_code"]);
          setStudentNumber(response.data["offender_name"]);
          setID(response.data["ticket_id"]);
          localStorage.setItem("studentNumber",response.data["offender_name"]);
        }
    
    const getEvidence = async () =>{
       const  response = await
            Axios('http://localhost:3001/fileNumber', {
            method: 'GET',
            params: {'ticket_id': localStorage.getItem("ticket_id")} //hardcoded for now
            })
            setFileNUm(Number(response.data));
          
        }
    
          
        const displayEvidence = (event)=>{
            Axios('http://localhost:3001/viewTicketFiles', {
            method: 'GET',
            responseType: 'blob', //Force to receive data in a Blob Format
            params: {'id': localStorage.getItem("ticket_id")}
          })
          .then(response => {
          //Create a Blob from the PDF Stream
            const file = new Blob(
              [response.data], 
              {type: 'application/pdf'});
              console.log(response)
            //Build a URL from the file
            files.push(response.data);
            //Open the URL on new Window
            
          }) 
        }

    let blobs = [];

    getTicket();
    getEvidence();
    displayEvidence();
    console.log(files);
    const oiMenu = () => navigate("/OIMenu");
    for(let i=0; i<files.length; i++){
        blobs.push(new Blob(
            [files[i]],
            { type: 'application/pdf' }))
    }

    console.log(blobs);

    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
    return(

        <div className = "pageWrapper">
            
            <h1>Ticket {localStorage.getItem("ticket_id")}</h1>
            <h1> Student: {studentNumber}</h1>
            <div className="ticketForm">
            <div>
            <Button variant ="contained"  onClick={oiMenu} >Investigate</Button>
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

            <Card >
        <CardActionArea >
        {blobs.map((fileName, index) =>  (
                <Document file={URL.createObjectURL(fileName)}>
                   
            <Page height={300} pageNumber={1}/>
            </Document>
             ))}
        </CardActionArea>
        <CardActions>
            <Button size="small" color="primary">
            OPEN
            </Button>
        </CardActions>
        </Card>  
            
            </div>
            
        </div>




    );

            }
        
