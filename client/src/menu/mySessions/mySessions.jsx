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
import { useNavigate } from 'react-router-dom';


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
    height: 550,
    bgcolor: 'background.paper',
    borderRadius: '7px',
    boxShadow: 24,
    p: 4,
    textAlign: "center",
    alignItems: "center"

};



export default function MySessions() {
    
    let navigate = useNavigate();
    const [sessions, setSessions] = React.useState([]);


    const colNamesPossible = ["Session Type", "Course", "Course Code","Date", "Time"];
    let colNames = [];
    let rows = [];




   

    useEffect(() => {
        Axios.get("http://localhost:3001/mySessions", {
           params: { 'studentID': sessionStorage.getItem("user_id") }
       }).then((res) => {
       setSessions(res.data);
       })
    },[]
   );

    





    colNames = colNamesPossible;
    rows = sessions;







    return (

        <>
            <div>
                <TableContainer component={Paper} className="pageWrapper" id="cT">
                    <Table sx={{ minWidth: 700 }} aria-label="customized table"  >
                        <TableHead>
                            <TableRow >
                                {colNames.map((headerItem, index) => (
                                    <StyledTableCell key={index}>{headerItem}</StyledTableCell>
                                ))}
                            </TableRow>

                        </TableHead>
                        <TableBody>
                            {Object.values(rows).map((obj, index) => (
                                <StyledTableRow key={index} hover={true} onClick={() => {sessionStorage.setItem("mysession_id",obj["session_id"]); navigate("/SessionPledges") }}>
                                    <StyledTableCell >{obj["session_type"]}</StyledTableCell>
                                    <StyledTableCell >{obj["course_name"]}</StyledTableCell>
                                    <StyledTableCell >{obj["course_code"]}</StyledTableCell>
                                    <StyledTableCell >{obj["date"]}</StyledTableCell>
                                    <StyledTableCell >{obj["time"]}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    );
}
