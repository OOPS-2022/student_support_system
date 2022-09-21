import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import "../page.css"
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { Stack, TextField } from '@mui/material';
import Axios from 'axios';
import Multiline from '../multiline';
import { shouldForwardProp } from '@mui/styled-engine';
import { useEffect } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import Close from '@mui/icons-material/Close';
import { MenuItem } from '@mui/material';
import { notify } from 'react-big-calendar/lib/utils/helpers';
import { AlternateEmail } from '@mui/icons-material';
import Brightness1Icon from '@mui/icons-material/Brightness1';
import FaceIcon from '@mui/icons-material/Face';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "rgb(252,179,5,0.4)",

    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  
    '&:nth-of-type(odd)': {
        backgroundColor: "rgb(147,183,214,0.4)",

    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    "&:hover": {
        backgroundColor: "rgba(6, 71, 150, 0.2) !important"
    },
}));





export default function CheckTable() {




    const [Sessiondata, setSessiondata] = React.useState([]);
    let sessionDataFinal = [];

    let studentNames = []; 
    useEffect(() => {
        const getSessiondata = async () => {
            const response = await Axios.get('http://localhost:3001/getChecklistAns');
            setSessiondata(response.data);

        }
        getSessiondata();

    }, []);


    function getAllSessions() {
        let sessionData = [];
        let session = [];
        let sessionIDs = [];

        for (let i = 0; i < Sessiondata.length; i++) {
            if (!(sessionIDs.indexOf(Sessiondata[i].session_id) > -1)) {
                sessionIDs.push(Sessiondata[i].session_id);
            }
        }

        for (let j = 0; j < sessionIDs.length; j++) {
            console.log(Sessiondata);
            let questions = [];
            let qNames = [];
            let students = [];
            session = [];
            for (let k = 0; k < Sessiondata.length; k++) {

                if (Sessiondata[k].session_id == sessionIDs[j]) {
                    if (!(questions.indexOf(Sessiondata[k].question_number) > -1)) {
                        questions.push(Sessiondata[k].question_number);
                    }
                    session.push(Sessiondata[k])



                }


            }
            for (let s = 0; s < session.length; s++) {
                let student = session[s].stu_id;
                let studentName = session[s].name;
                if (!(students.indexOf(student) > -1)) {
                    students.push(student);
                    let icon = [];
                    let qStudent = [];
                    for (let m = 0; m < session.length; m++) {
                        if (session[m].stu_id == student) {
                            if (session[m].checked == 1) {
                                icon = <CheckIcon sx={{ color: 'green' }} />;
                            } else if (session[m].checked == 0) {
                                icon = <Close sx={{ color: 'red' }} />;
                            }
                            qStudent.push([icon]);
                        }

                    }


                    
                    qNames.push([studentName, qStudent]);
                    if(!(studentNames.indexOf(studentName) > -1)){
                        studentNames.push(studentName);
                    }
                    
                }


            }
            sessionData.push([sessionIDs[j], questions, qNames]);




        }
        console.log(sessionData);
        sessionDataFinal = sessionData;
    }

    let sessionData1 = [{ "Session": "1", "Questions": [{ "Question": { "QuestionName": "Q1", "QuestionData": [{ "Leandra": "checked", "Lizl": "unchecked" }] } }] }];

    return (
        <>
            <div>
                
                {getAllSessions()}
                <div style={{ display: "inline-flex", padding: "20px" }}>
                    <TableContainer component={Paper} className="pageWrapper" id="cT">
                        <Table aria-label="customized table"  >
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center" colSpan={2} >Session: </StyledTableCell>
                                </TableRow>


                                <TableRow >
                                
                                  

                                        <StyledTableCell  align="center" colSpan={2}> Questions:</StyledTableCell>


                                

                                </TableRow >
                            </TableHead>
                            {studentNames.map((headerItem, i) => (
                            <TableBody>

                               

                       
                                <StyledTableRow>
                                    <StyledTableCell key={i}><FaceIcon ></FaceIcon></StyledTableCell>
                                            <StyledTableCell style={{fontSize: "large"}} component="th" scope="row" align="left" key={i}>{headerItem} </StyledTableCell>
                                           





                                        
                                        </StyledTableRow>

                                
                            </TableBody>
                            ))}
                        </Table>
                    </TableContainer>
                </div>
                {sessionDataFinal.map((headerItem, index) => (
                    <>
                        <div key={index} style={{ display: "inline-flex", padding: "20px" }}>
                            <TableContainer component={Paper} className="pageWrapper" id="cT">
                                <Table aria-label="customized table"  >

                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell align="center" >Session {headerItem[0]}</StyledTableCell>
                                        </TableRow>


                                        <TableRow >
                                           
                                            {headerItem[1].map((item, k) => (

                                                <StyledTableCell align="center" key={k}>{item} </StyledTableCell>


                                            ))}

                                        </TableRow >
                                    </TableHead>
                                    <TableBody>
                                        {headerItem[2].map((row, i) => (
                                            <StyledTableRow  >
        
                                                {row[1].map((check, s) => (

                                                    <StyledTableCell align='center' key={s}>{check}</StyledTableCell>

                                                ))}
                                            </StyledTableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </>
                ))}
            </div>
            
        </>


    );
}