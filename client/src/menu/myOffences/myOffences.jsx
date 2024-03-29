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
        backgroundColor: "rgb(79,147,210)",
    fontSize: 20,

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

    }, []
    );
    const handleClick = () => {
        navigate("/MyTickets");

    }

    const [filter, setFilter] = React.useState("offence_name");
    const handleFilter = (event) => {
        setFilter(event.target.value);
    };

    const [copyList, setCopyList] = React.useState(offences);
    const requestSearch = (searched) => {
        console.log(filter);

        setCopyList(Object.values(offences).filter((item) =>
            item[filter].toLowerCase().includes(searched.toLowerCase())))
            ;
    }

    const colNames = ["Offence Name", "Course Code", "Offence Status"]
    return (
        <>
            <div className="pageWrapper">

                <TableContainer component={Paper} className="pageWrapper" id="cT">
                    <div style={{ display: "inline-flex", padding: "10px" }}>
                   
                        <TextField
                            style={{ minWidth: "75%" }}

                            variant='outlined'
                            placeholder='Search...'
                            type='search'
                            onInput={(e) => requestSearch(e.target.value)}
                        />


                        
                        <TextField style={{ minWidth: "22%", paddingLeft: "15px" }}
                            id="outlined-name"
                            select
                            defaultValue={"offence_name"}
                            value={filter}
                            onChange={handleFilter}
                            label="Filter by"
                        >
                            <MenuItem value={"offence_name"}>
                                Offence name
                            </MenuItem>
                            <MenuItem value={"crs_code"}>
                                Course code
                            </MenuItem>




                        </TextField>
                        
                    </div>
                    <Table sx={{ minWidth: 500 }} aria-label="customized table"  >
                        <TableHead>
                            <TableRow >
                                {colNames.map((headerItem, index) => (
                                    <StyledTableCell key={index}>{headerItem}</StyledTableCell>
                                ))}
                            </TableRow>

                        </TableHead>
                        <TableBody>
                            {Object.values(copyList.length > 0 ? copyList : offences).map((obj, index) => (
                                <StyledTableRow key={index} onClick={() => { handleClick(); sessionStorage.setItem("ticket_id_student", obj["ticket_id"]); }}  >
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