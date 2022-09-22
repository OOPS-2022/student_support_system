
import React from "react";
import "../page.css";
import { Stack, Modal, MenuItem, TextField, Button, Card, CardActionArea, CardMedia, CardContent, Typography, CardActions } from "@mui/material";
import Axios from 'axios';
import Box from '@mui/material/Box';
import Label from "../label";
import { Link, useNavigate, useParams } from "react-router-dom";
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


export default function EmbeddedSSession() {
    const [open, setOpen] = React.useState(false);
    const [checklist, setChecklist] = React.useState([]);
    const [answer, setAnswer]=React.useState("");
    const [index, setIndex] = React.useState("");
    const [checkID, setCheckID]= React.useState("");
    const [checked, setChecked] = useState("");
    const [studentID, setStudentID]=useState(0);
    //const studentID=0;
let {id} = useParams();
//function getChecklist(id){

function getData(id){
    Axios.get('http://localhost:3001/checklistForSession', {
            params: { "session_id": id }
        }).then(response => {
            console.log(response.data);
            setChecklist(response.data);
        }
        );
}

     useEffect(() => {
          
        getID();
        getData(id);
        //setStudentID(getID());

    }, []);

    function getID(){
        window.addEventListener('message', function(event) {
        //alert(`Received ${event.data} from ${event.origin}`);
        event.preventDefault();
            console.log("event data:",event.data.userid);
        setStudentID(event.data.userid);
        //return event.data.userid;
      });
    }
    //let studentId=getID();
    //console.log(studentId);
    
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

    const check = () => {
        setChecked(true);
    }

 
    const submit = () =>{
        getID();
        console.log("StudentID:", studentID);
        console.log("CheckID: ", checklist[0].check_id);
        console.log("Answers: ", answers);
        console.log("Questions: ", questions);
        Axios.post('http://localhost:3001/studentChecklistAnswers', {
            studentID: studentID,
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
                  
                </Modal>

            </div></>





    );

}