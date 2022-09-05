
import React from "react";
import "../page.css";
import { Stack, Modal, MenuItem, TextField, Button, Card, CardActionArea, CardMedia, CardContent, Typography, CardActions } from "@mui/material";
import Axios from 'axios';
import Box from '@mui/material/Box';
import Label from "../label";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { scryRenderedDOMComponentsWithClass } from "react-dom/test-utils";
import { fontFamily } from "@mui/system";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { yesterday } from "react-big-calendar/lib/utils/dates";

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
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    height: 650,
    bgcolor: 'background.paper',
    borderRadius: '7px',
    boxShadow: 24,
    p: 4,
    textAlign: "center",
    alignItems: "center",
    fontFamily: "Arial, Helvetica, sans-serif"

};


export default function SessionPledges() {
    const [open, setOpen] = React.useState(false);
    const [sessionPledges, setSessionPledges] = React.useState([]);
    const [pledge, setPledge] = React.useState("");
    const [paragraph, setParagraph] = useState("");
    const [file, setFile] = useState({}); //file uploaded by student if signed pledge
    const [message, setMessage] = useState(""); //the plege message if clicked pledge
    const [type, setType] = useState(""); //type of pledge
    const [checked, setChecked] = useState("");
    const [checklist, setChecklist] = React.useState([]);
    const [answer, setAnswer]=React.useState("");
    const [index, setIndex] = React.useState("");
    const [checkID, setCheckID]= React.useState("");
    
    
    
    

    useEffect(() => {

        let id = sessionStorage.getItem("mysession_id");
        Axios.get('http://localhost:3001/ckecklistForSession', {
            params: { "session_id": id }
        }).then(response => {
            console.log(response.data);
            setChecklist(response.data);
        }
        );
    }, []);

    
    function getQuestions() {
        let qs = [];
        for(let i=0; i<checklist.length; i++){
            qs.push(checklist[i].question_number);
        }
        return qs;
    }

    let questions = getQuestions();
    console.log(questions);
    let answers = [];
    for(let i=0;i<questions.length;i++){
        answers.push(-1);
    }
    const validate = () => {
        if (paragraph == "") {
            alert("Please give a description of your undestanding.");
            return false;
        }
        if (file == null) {
            alert("Please upload a file");
            return false;
        }
        return true;
    }

    const check = () => {
        setChecked(true);
    }

    async function viewPledge(pledgeID) {
        const response = await Axios('http://localhost:3001/sessionPledgeLink', {
            method: 'GET',
            responseType: 'blob', //Force to receive data in a Blob Format
            params: { 'pledge_id': pledgeID }
        });
        //Create a Blob from the PDF Stream
        const file = new Blob(
            [response.data],
            { type: 'application/pdf' });
        console.log(response)
        //Build a URL from the file
        const fileURL = URL.createObjectURL(file);
        //Open the URL on new Window
        window.open(fileURL);
    }
    //Only if have to upload signed plegde
    const fileChange = (event) => {
        setFile(event.target.files[0]);
    };

    //uploading signed pledge
    const upload = (pledgeID) => {
        if (validate()) {
            let formData = new FormData();
            formData.append("file", file);
            formData.append("paragraph", paragraph);
            formData.append("sessionID", sessionStorage.getItem("mysession_id"));
            formData.append("studentID", sessionStorage.getItem("user_id")); //hardcoded for now. Get id from user login
            formData.append("pledgeID", pledgeID); //also hardcoded for now
            fetch("http://localhost:3001/submitSession", {
                method: "post",
                body: formData
            })
        }
    };

    //raw html code to embed onto do test if there is a clicked pledge
    const rawHTML = `
       <div>
         <label>
         <input type="checkbox" id="myCheck">
         `+ message + `</label>
         <div>
         </div>
       </div>
       `;


    let navigate = useNavigate();
    useEffect(() => {

        let id = sessionStorage.getItem("mysession_id");
        Axios.get('http://localhost:3001/sessionPledges', {
            params: { "session_id": id }
        }).then(response => {
            console.log(response.data);
            setSessionPledges(response.data);
        }
        );
    }, []);
    const handleOpen = () => {
        setOpen(true);
    }
    


    const submit = () =>{
        Axios.post('http://localhost:3001/studentChecklistAnswers', {
            studentID:sessionStorage.getItem("user_id"),
            checkID: checklist[0].check_id,
            answers: answers,
            questions: questions

         }
        )
    }
    

    const handleClose = () => { setOpen(false); }

    console.log(answers);
    console.log(questions);
    return (
        <><div className="pageWrapper">
            <div>
                <h1>Session</h1>
                <h1>Pledges To Do</h1>
                {Object.values(sessionPledges).map((pledge, index) => <div>
                    <Button onClick={() => { setPledge(pledge); handleOpen(); }} variant="text" key={index}>{pledge.pledge_name}({pledge.pledge_type})</Button>
                </div>
                )}
                <h1>Questions To Answer</h1>
                <TableContainer component={Paper} id="cT">
                    <Table sx={{ minWidth: 500 }} aria-label="customized table">
                        <TableHead>
                            <TableRow >
                                {checklist.map((headerItem, index) => (

                                    <StyledTableCell align="center" key={index}> {headerItem["question_number"]}</StyledTableCell>


                                ))}

                            </TableRow>


                        </TableHead>
                        <TableBody>
                            <StyledTableRow  >
                                {checklist.map((obj, index) => (

                                    <StyledTableCell align="center" key={index} >{obj["question_details"]}</StyledTableCell>

                                ))}

                            </StyledTableRow>
                            <StyledTableRow >
                                {checklist.map((obj, index) => (
                                    <>
                                    <StyledTableCell align="center">
                                        <Button onClick ={()=>{answers[index]= 1; }}>Yes</Button>
                                        <Button onClick ={()=>{answers[index]= 0; }}>No</Button>
                                        </StyledTableCell>
                                    </>
                                ))}
                            </StyledTableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <Button onClick={submit}>Submit</Button>
            </div>
        </div><div>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Stack direction="column" spacing={2} sx={{ justifyContent: "center", alignItems: "center" }}>
                            <h1>{pledge["pledge_name"]}</h1>
                            <label>Please write a paragraph to show your understanding of the pledge:</label>
                            <br></br>
                            <textarea id="story" name="story" rows="5" cols="33" onChange={(e) => setParagraph(e.target.value)} />
                            <br></br>
                            {!(pledge["pledge_type"] == "Clicked Pledge") && (<label>Please upload your signed pledge here:</label>)}
                            {!(pledge["pledge_type"] == "Clicked Pledge") && (<br></br>)}
                            {!(pledge["pledge_type"] == "Clicked Pledge") && (<input type="file" onChange={fileChange} />)}
                            {!(pledge["pledge_type"] == "Clicked Pledge") && (<br></br>)}
                            {!(pledge["pledge_type"] == "Clicked Pledge") && (<Button variant="contained" onClick={() => { upload(pledge["pledge_id"]); }}>upload</Button>)}
                            {!(pledge["pledge_type"] == "Clicked Pledge") && (<Button variant="contained" onClick={() => { viewPledge(pledge["pledge_id"]); }}>View pledge</Button>)}
                            {(pledge["pledge_type"] == "Clicked Pledge") && (<div dangerouslySetInnerHTML={{ __html: rawHTML }}></div>)}
                            <Button onClick={handleClose} variant="text">Done</Button>
                            <Button onClick={handleClose} variant="text">Cancel</Button>
                        </Stack>

                    </Box>
                </Modal>

            </div></>





    );

}