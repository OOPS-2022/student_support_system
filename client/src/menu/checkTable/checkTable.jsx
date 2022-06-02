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





export default function CheckTable() {




    //let sessionData = [{ "Session": "1", "Questions":[{"Question":{"QuestionName": "Q1", "QuestionData":[{ "Leandra": "checked", "Lizl": "unchecked" }]}}]}]
    let checked = ["yes", "yes", "no", "yes","yes"];
    let icons = [];
    for(let i = 0; i<checked.length;i++){
        console.log()
        if(checked[i] == "yes"){
            icons.push(<CheckIcon/>);
        }else if(checked[i] =="no"){
            icons.push(<Close/>);
        }
    }
    let name1 = { "name": "Lizl", "questions": icons };
    let name2 = { "name": "Leandra", "questions": icons };
    let rowNames = [name1, name2];
    let colNamesSessions = ["Session 1", "Session 2"];
    let colNamesQuestions = ["Q1", "Q2", "Q3", "Q4","Q5"];

    return (

        <>
            <div>
                {colNamesSessions.map((headerItem, index) => (
                    <div key={index} style={{ display: "inline-flex", padding: "20px" }}>
                        <TableContainer component={Paper} className="pageWrapper" id="cT">
                            <Table aria-label="customized table"  >

                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="center" colSpan={checked.length+1}>{headerItem}</StyledTableCell>
                                    </TableRow>

                                    
                                        <TableRow >
                                            <StyledTableCell>{ }</StyledTableCell>
                                            {colNamesQuestions.map((item, k) => (

                                                <StyledTableCell align="right" key={k}>{item} </StyledTableCell>


                                            ))}

                                        </TableRow >
                                   
                                    

                                </TableHead>
                                <TableBody>
                                    {rowNames.map((row, i) => (
                                        <StyledTableRow key={row["name"]}>
                                            <StyledTableCell component="th" scope="row">
                                                {row.name}
                                            </StyledTableCell>
                                            {row["questions"].map((check, s) => (

                                                <StyledTableCell key={s}>{check}</StyledTableCell>

                                            ))}
                                        </StyledTableRow>
                                    ))}
                                </TableBody>



                            </Table>
                        </TableContainer>
                    </div>
                ))}
            </div>
        </>
    );
}
