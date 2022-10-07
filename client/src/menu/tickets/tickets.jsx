import React from "react";
import "../page.css";
import "./tickets.css"
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { MenuItem, TextField, Button, Card, CardActionArea, CardMedia, CardContent, Typography, CardActions } from "@mui/material";
import Axios from 'axios';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Label from "../label";
import { Document, Page } from "react-pdf";
import samplePDF from './sample.pdf';
import { pdfjs } from "react-pdf";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SpecialCard from "./card";
import IconButton from '@mui/material/IconButton';
import FaceIcon from '@mui/icons-material/Face';
import Popover from '@mui/material/Popover';
import Modal from '@mui/material/Modal';
import Stack from "@mui/material/Stack";

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
    p: 2,
    textAlign: "center",
    alignItems: "center"

};

async function addPeople(role, email) {
    return Axios.post("http://localhost:3001/...", {
        role: role,
        email: email

    });
}

async function deletePeople(role, email) {
    return Axios.post("http://localhost:3001/...", {
        role: role,
        email: email

    });
}

async function getPeople(ticket_id) {
    return Axios.post("http://localhost:3001/...", {
       ticket_id: ticket_id

    });
}
export default function Ticket() {
    const [status, setStatus] = React.useState("");
    const [desc, setDesc] = React.useState("");
    const [crsCode, setCrsCode] = React.useState();
    const [studentNumber, setStudentNumber] = React.useState();
    const [pdfString, setPdfString] = useState('');
    const [ticket_id, setID] = useState("");
    const [fileNum, setFileNum] = useState(0);
    const [files, setFiles] = useState([]);
    let navigate = useNavigate();

    const getTicket = async () => {
        const response = await Axios.get('http://localhost:3001/selectOffence', {
            params: { 'ticket_id': sessionStorage.getItem("ticket_id") }
        });
        console.log(response.data["offence_status"]);
        setStatus(response.data["offence_status"]);
        setDesc(response.data["details"]);
        setCrsCode(response.data["crs_code"]);
        setStudentNumber(response.data["offender_name"]);
        setID(response.data["ticket_id"]);
        sessionStorage.setItem("studentNumber", response.data["offender_name"]);
    }

    getTicket();

    useEffect(() => {
        const getFiles = async () => {
            const response = await Axios('http://localhost:3001/fileNumber', {
                method: 'GET',
                params: { 'ticket_id': sessionStorage.getItem("ticket_id") } //hardcoded for now
            });
            for (let i = 0; i < Number(response.data); i++) {
                const response = await Axios.get('http://localhost:3001/viewTicketFiles', {
                    responseType: 'blob', //Force to receive data in a Blob Format
                    params: { 'id': sessionStorage.getItem("ticket_id"), "i": i }
                });
                // Create a Blob from the PDF Stream
                const file = new Blob(
                    [response.data],
                    { type: 'application/pdf' });
                setFiles(OldArray => [...OldArray, file]);

                //Open the URL on new Window

            }
        }
        getFiles();
    }, []);


    console.log("files:" + files[0]);
    const oiMenu = () => navigate("/OIMenu");
    const [isObserver, setIsObserver] = React.useState(true);
    const [isContributer, setIsContributer] = React.useState(true);
    const [open, setOpen] = React.useState(false);

    const handleCloseModal = () => setOpen(false);
    //const people = [{ user_name: "lizl", role: "observer" }, { user_name: "leandra", role: "collaborator" }];
    const [isView, setView] = React.useState(false);
    const [isAdd, setAdd] = React.useState(false);
    const [people, setPeople] = React.useState([]);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorEl2, setAnchorEl2] = React.useState(null);

    const handleClick1 = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClick2 = (event) => {
        setAnchorEl2(event.currentTarget);
    };

    const handleOpen1 = () => { setOpen(true); }
    //const handleOpen2 = () => { setOpen(true); setView(false); setAdd(true); }
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClose2 = () => {
        setAnchorEl2(null);
    };

    const openPop = Boolean(anchorEl);
    const openPop2 = Boolean(anchorEl2);
    const id = open ? 'simple-popover' : undefined;
    const id2 = open ? 'simple-popover2' : undefined;

    const [email, setEmail] = React.useState("");
    const [userRole, setUserRole] = React.useState("");

    const handleOption = (e) =>{
        setUserRole(e.target.value);
    }

    const addHandle = async (e) => {
        const response = await addPeople(email, role); const response2 = await getPeople(ticket_id); setPeople(response2.data); handleClose();
    }

    const deleteHandle = async (e) => {
        const response = await deletePeople(email, role); const response2 = await getPeople(ticket_id); setPeople(response2.data); handleClose();
    }

    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
    return (

        <><div className="pageWrapper">
            <Stack direction="row" spacing={2} padding="15px">
                <Button onClick={handleOpen1} variant="outlined" sx={{ width: "15%", fontFamily: "Arial, Helvetica, sans-serif", fontSize: "large" }} startIcon={<FaceIcon />} >
                    <p1>People</p1>
                </Button>
            </Stack>
            <h1>Ticket {sessionStorage.getItem("ticket_id")}</h1>
            <h1> Student: {studentNumber}</h1>
            <div className="ticketForm">
                <div>
                    <Button variant="contained" onClick={oiMenu}>Investigate</Button>
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
                {files.map((file) => (
                    <Card>
                        <CardActionArea>
                            <Document file={file}>
                                <Page height={500} pageNumber={1} />
                            </Document>
                        </CardActionArea>
                        {/* <CardActions>
                <Button size="small" color="primary">
                    OPEN
                </Button>
            </CardActions> */}
                    </Card>
                ))}
            </div>

        </div>
            <div>
                <Modal
                    open={open}
                    onClose={handleCloseModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <div>



                        <Box sx={style}>
                            <TableContainer>
                                <Table sx={{ minWidth: 500 }} aria-label="customized table">

                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell >User email</StyledTableCell>
                                            <StyledTableCell >Role</StyledTableCell>

                                        </TableRow>

                                    </TableHead>
                                    <TableBody>
                                        <>
                                            {Object.values(people).map((obj, index) => (
                                                <StyledTableRow key={index} onClick={(e) => {setUserRole(obj["role"]); setEmail(obj["user_name"]); handleClick2(e); }} hover={true}>
                                                    <StyledTableCell>{obj["user_name"]}</StyledTableCell>
                                                    <StyledTableCell>{obj["role"]}</StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                            <StyledTableRow >
                                                <StyledTableCell colSpan={2} sx={{ backgroundColor: "white" }}>  <Button onClick={handleClick1}>Add User</Button></StyledTableCell>
                                            </StyledTableRow>
                                        </>
                                    </TableBody>


                                </Table>
                            </TableContainer>
                        </Box>
                    </div>
                </Modal>
            </div><div>
                <Popover
                    id={id2}
                    open={openPop}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                >
                    <Box sx ={{padding: "30px",display: "flex", flexDirection: "column"}}>
                    <TextField label="User email:"
                        style={{ minWidth: "100%" , paddingBottom: "15px" }}
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }} />
            
                    <TextField style={{ minWidth: "100%", paddingBottom: "15px"}}
                        label="Role"
                        select
                        onChange={handleOption}
                    >
                    

                            <MenuItem value={"collaborator"}>
                                Collaborator
                            </MenuItem>
                            <MenuItem  value={"observer"}>
                                Observer
                            </MenuItem>


                       
    
                    </TextField>
                    <div style ={{display: "flex",flexDirection: "row", padding: "15px"}}>
                    <Button sx={{ minWidth: "50%", alignSelf: "center"}} onClick = {addHandle} variant ="contained">Add</Button>
                    <Button onClick={handleClose}>Cancel</Button>
                    </div>
                    </Box>

                </Popover>
                <Popover
                id="pop2"
                open={openPop2}
                anchorEl={anchorEl2}
                onClose={handleClose2}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}>
                <Button onClick={deleteHandle}>Delete</Button>
                <Button onClick = {handleClose2}>Cancel</Button>
                </Popover>
            </div></>




    );

}

