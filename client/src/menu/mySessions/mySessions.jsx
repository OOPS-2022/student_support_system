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
import { MenuItem } from '@mui/material';


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



export default function MySessions() {

    let navigate = useNavigate();
    const [sessions, setSessions] = React.useState([]);


    const colNamesPossible = ["Session Type", "Course", "Course Code", "Date", "Time"];
    let colNames = [];







    useEffect(() => {

        const getSess = async () => {
            const response = await Axios.get('http://localhost:3001/mySessions', {
                params: { 'studentID': sessionStorage.getItem("user_id") }
            });
            setSessions(response.data);
            console.log(response.data);


        }
        getSess();
    }, []);







    colNames = colNamesPossible;


    const [filter, setFilter] = React.useState("session_type");
    const handleFilter = (event) => {
        setFilter(event.target.value);
    };

    const [copyList, setCopyList] = React.useState(sessions);
    const requestSearch = (searched) => {
        console.log(filter);

        setCopyList(Object.values(sessions).filter((item) =>
            item[filter].toLowerCase().includes(searched.toLowerCase())))
            ;
    }





    return (

        <>
            <div>
                <TableContainer component={Paper} className="pageWrapper" id="cT">
                    <div style={{ display: "inline-flex" , padding: "10px"}}>
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
                            defaultValue={"session_type"}
                            value={filter}
                            onChange={handleFilter}
                            label="Filter by"
                        >
                            <MenuItem value={"session_type"}>
                                Session Type
                            </MenuItem>
                            <MenuItem value={"course_name"}>
                                Course
                            </MenuItem>




                        </TextField>
                       


                    </div>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table"  >
                        <TableHead>
                            <TableRow >
                                {colNames.map((headerItem, index) => (
                                    <StyledTableCell key={index}>{headerItem}</StyledTableCell>
                                ))}
                            </TableRow>

                        </TableHead>
                        <TableBody>
                            {Object.values(copyList.length > 0 ? copyList : sessions).map((obj, index) => (
                                <StyledTableRow key={index} hover={true} onClick={() => { sessionStorage.setItem("mysession_id", obj["session_id"]); navigate("/SessionPledges") }}>
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
