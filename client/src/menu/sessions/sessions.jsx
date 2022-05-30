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
import { MenuItem } from '@mui/material';
import useForceUpdate from 'use-force-update';



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
    height: 600,
    bgcolor: 'background.paper',
    borderRadius: '7px',
    boxShadow: 24,
    p: 4,
    textAlign: "center",
    alignItems: "center"

};



export default function Sessions() {
    const [open, setOpen] = React.useState(false);
    const [sessions, setSessions] = React.useState([]);
    const [sessionID, setSessionID] = React.useState("");
    const [sessionType, setSessionType] = React.useState("");
    const [course, setCourse] = React.useState("");
    const [date, setDate] = React.useState();
    const [time, setTime] = React.useState();
    const [hide, setHide] = React.useState(false);
    const [label, setLabel] = React.useState("");
    const [sessionName, setSessionName]=React.useState("");
    
    const [option, setOption] = React.useState("");
    const [value, setValue] = React.useState();

    const handleOption = (e) => {
        setOption(e.target.value);;
        setSessionType(e.target.value);
    };

    const [pledge, setPledge] = React.useState("");
    const handlePledge = (e) => {
        setPledge(e.target.value["pledge_name"]);;
    };

    const [pledges, setPledges]=React.useState([]);
    useEffect(() => {
        Axios.get('http://localhost:3001/viewPledges').then((response) => {
          setPledges(response.data)
        })
      }, []);


    const colNamesPossible = ["Session Name","Session Type","Course", "Date", "Time"];
    let colNames = [];
    let rows = [];

    const refresh = ()=>{
        // re-renders the component
        setValue({});
    }

    const sessionTypes = ["Test", "Tutorial", "Exam"];
    const editSessions =  () => {
        Axios.post("http://localhost:3001/updateses", {
            session_id: sessionStorage.getItem("session_id"),
            date: date,
            time: time,
            session_name: sessionName
        });
    }

    const addSessions = () => {
        Axios.post("http://localhost:3001/insertses", {
            course_id: course,
            sestype: sessionType,
            date: date,
            time: time,
            session_name:sessionName,
            creator_id: sessionStorage.getItem("user_id"),
            pledges: [3,4]

        });

        
    
    }



    const getSessions = async () => {
        const response = await Axios.get('http://localhost:3001/sessions');
        setSessions(response.data);
    }

    useEffect(() => {
        Axios.get('http://localhost:3001/sessions').then((response) => {
            setSessions(response.data);



        }
        )

    }, []
    );

    

    


    colNames = colNamesPossible;
    rows = sessions;

    
   



    const handleOpen = () => {
        setLabel("Edit");
        setOpen(true);
        setHide(true);
    }

    const handleClose = () => {setOpen(false); window.location.reload();}
    const editHandle = (e) => { editSessions(); handleClose(); }
    const addHandle = (e) => { setLabel("Add"); setOpen(true); setHide(false); setDate(""); setTime(""); setCourse(""); setSessionType("") }
    const add = (e) => { addSessions(); handleClose();   }
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
                                <StyledTableRow key={index} onClick={() => { handleOpen(); sessionStorage.setItem("session_id", [obj["session_id"]]); setCourse(obj["course_id"]), setSessionType(obj["session_type"]), setDate(obj["date"]), setTime(obj["time"]), setSessionName(obj["session_name"]) }} hover={true}>
                                    <StyledTableCell >{obj["session_name"]}</StyledTableCell>
                                    <StyledTableCell >{obj["session_type"]}</StyledTableCell>
                                    {/* <StyledTableCell >{obj["pledge_type"]}</StyledTableCell> */}
                                    <StyledTableCell >{obj["course_id"]}</StyledTableCell>
                                    <StyledTableCell >{obj["date"]}</StyledTableCell>
                                    <StyledTableCell >{obj["time"]}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                            <Button variant="outlined" onClick={addHandle} sx={{ marginRight: "650px", marginTop: "20px" }}>add</Button>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <div>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Stack direction="column" spacing={2} sx={{ justifyContent: "center", alignItems: "center" }}>
                            <h1>{label}:</h1>

                            {!hide && ( <TextField
                                id="outlined-required"
                                label="Session Name"
                                defaultValue={sessionName}
                                sx={{ padding: "5px", width: "90%" }}
                                onChange={(e) => {
                                    setSessionName(e.target.value);

                                }
                                }
                            />)}

                            {!hide && ( <TextField
                                id="outlined-required"
                                label="Course"
                                defaultValue={course}
                                sx={{ padding: "5px", width: "90%" }}
                                onChange={(e) => {
                                    setCourse(e.target.value);

                                }
                                }
                            />)}
                            {!hide && (<TextField style={{ minWidth: "90%" }}
                                id="outlined-name"
                                label="Session Type"
                                select
                                defaultValue={sessionTypes[0]}
                                value={option}
                                onChange={handleOption}
                            >
                                {sessionTypes.map((option,index) => (

                                    <MenuItem key ={index} value={option} >
                                        {option}
                                    </MenuItem>


                                ))}
    

                            </TextField>)}

                            <TextField
                                id="outlined-required"
                                label="Session Name"
                                defaultValue={sessionName}
                                sx={{ padding: "5px", width: "90%" }}
                                onChange={(e) => {
                                    setSessionName(e.target.value);

                                }
                                }
                            />

                            <TextField
                                id="outlined-required"
                                label="Date"
                                defaultValue={date}
                                sx={{ padding: "5px", width: "90%" }}
                                onChange={(e) => {
                                    setDate(e.target.value);

                                }
                                }
                            />
                            <TextField
                                id="outlined-required"
                                label="Time"
                                defaultValue={time}
                                sx={{ paddingTop: "5px", width: "90%" }}
                                onChange={(e) => {
                                    setTime(e.target.value);

                                }
                                }

                            />'
                            <TextField style={{ minWidth: "90%" }}
                                id="outlined-name"
                                label="Pledge"
                                select
                                value={pledge["pledge_name"]}
                                onChange={handlePledge}
                            >
                                {pledges.map((pledge) => (

                                    <MenuItem key ={pledge} value={pledge} >
                                        {pledge["pledge_name"]}
                                    </MenuItem>


                                ))}
    

                            </TextField>





                            <div>
                                {hide && (<Button variant="contained" sx={{ marginRight: "10px" }} onClick={editHandle} >Update</Button>)}
                                {!hide && (<Button variant="contained" onClick={add}  >Add</Button>)}
                            </div>
                        </Stack>
                        <Button style={{ bottom: "-5%" }} onClick={handleClose}>Cancel</Button>
                    </Box>
                </Modal>

            </div>
        </>
    );
}
