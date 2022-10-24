
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
import Checkbox from '@mui/material/Checkbox';
import { CheckBox } from "@mui/icons-material";

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



export default function CheckListPreview(props) {

 

    const [checked, setChecked] = React.useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

return (
    <><div >
        <div style = {{backgroundColor: "rgb(79,147,210,0.1)", padding: "15px", borderRadius: "7px"}}>
            <h1>Preview</h1>
            <TableContainer component={Paper} id="cT">
                <Table sx={{ minWidth: 500 }} aria-label="customized table">
                    <TableHead>
                        <TableRow >
                            {props.checklist.map((headerItem, index) => (

                                <StyledTableCell align="center" key={index}> {index}</StyledTableCell>


                            ))}

                        </TableRow>


                    </TableHead>
                    <TableBody>
                        <StyledTableRow  >
                            {props.checklist.map((obj, index) => (

                                <StyledTableCell align="center" key={index} >{obj}</StyledTableCell>

                            ))}

                        </StyledTableRow>
                        <StyledTableRow >
                            {props.checklist.map((obj, index) => (
                                <>
                                <StyledTableCell align="center">
                                        <input type="checkbox" id="check" ></input>
                                    </StyledTableCell>
                                </>
                            ))}
                        </StyledTableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    </div></>
  
)}
