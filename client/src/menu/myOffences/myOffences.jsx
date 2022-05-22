import React from "react";
import "../page.css"
import "./myOffences.css";
import { MenuItem, TextField, Button } from "@mui/material";
import Axios from 'axios';
import { TableContainer } from "@mui/material";
import { Table } from "@mui/material";
import { TableHead } from "@mui/material";
import { TableRow } from "@mui/material";
import { TableBody } from "@mui/material";
import { Paper } from "@mui/material";
import styled from "@emotion/styled";
import { TableCell } from "@mui/material";
import { tableCellClasses } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

export default function MyOffence() {
    let navigate = useNavigate();

    const [offences, setOffences] = React.useState([]);
    useEffect(() => {
         Axios.get("http://localhost:3001/viewMyOffences", {
            params: { 'userID': sessionStorage.getItem("user_id") }
        }).then((res) => {
        console.log(res.data);
        setOffences(res.data);
        }
       )

    },[]
    );
    const handleClick = () =>{
        navigate("/MyTickets");

    }

    const colNames = ["Offence Name", "Course Code", "Offence Status"]
    return (
        <>
            <div className="pageWrapper">
                <h1>My Offences</h1>
          
                        <TableContainer component={Paper} className="pageWrapper" id="cT">
                            <Table sx={{ minWidth: 500 }} aria-label="customized table"  >
                                <TableHead>
                                    <TableRow >
                                        {colNames.map((headerItem, index) => (
                                            <StyledTableCell key={index}>{headerItem}</StyledTableCell>
                                        ))}
                                    </TableRow>

                                </TableHead>
                                <TableBody>
                                    {offences.map((obj, index) => (
                                        <StyledTableRow key={index} onClick ={ () =>{ handleClick();sessionStorage.setItem("ticket_id_student",obj["ticket_id"]);}}  >
                                            <StyledTableCell >{obj["offence_name"]}</StyledTableCell>
                                            <StyledTableCell >{obj["crs_code"]}</StyledTableCell>
                                            <StyledTableCell>{obj["offence_status"]}</StyledTableCell>

                                        </StyledTableRow>
                                    ))}

                                </TableBody>
                            </Table>
                        </TableContainer>
              
                        </div>
        </>
    );

}