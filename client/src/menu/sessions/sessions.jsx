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
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';






const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    root: {
        maxWidth: "100px"
    },
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
    height: 650,
    bgcolor: 'background.paper',
    borderRadius: '7px',
    boxShadow: 24,
    p: 4,
    textAlign: "center",
    alignItems: "center"

};

async function getSessions() {
    return await Axios.get('http://localhost:3001/sessions');
}

async function getSessionPledges() {
    const response = await Axios.get('http://localhost:3001/sessions');
    let pledges = [];
    for (let i = 0; i < response.data.length; i++) {
        let id = response.data[i].session_id;
        const response2 = await Axios.get('http://localhost:3001/sessionPledges', {
            params: { "session_id": id }
        });
        const temp1 = [response.data[i].session_id, response2.data];
        pledges.push(temp1);



    }
    console.log(pledges);
    return pledges;



}


async function editSessions(date, time, sessionName) {
    return Axios.post("http://localhost:3001/updateses", {
        session_id: sessionStorage.getItem("session_id"),
        date: date,
        time: time,
        session_name: sessionName
    });
}

async function addSessions(course, sessionType, date, time, sessionName, pledgeList) {
    return Axios.post("http://localhost:3001/insertses", {
        course_id: course,
        sestype: sessionType,
        date: date,
        time: time,
        session_name: sessionName,
        creator_id: sessionStorage.getItem("user_id"),
        pledges: pledgeList

    });
}



export default function Sessions() {

    const [open, setOpen] = React.useState(false);
    const [sessions, setSessions] = React.useState([]);
    const [sessionName, setSessionName] = React.useState("");
    const [sessionType, setSessionType] = React.useState("");
    const [course, setCourse] = React.useState("");
    const [date, setDate] = React.useState();
    const [time, setTime] = React.useState();
    const [hide, setHide] = React.useState(false);
    const [label, setLabel] = React.useState("");
    const [sessionPledges, setSessionPledges] = React.useState([]);



    const [filter, setFilter] = React.useState("session_name");
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





    const [option, setOption] = React.useState("");


    const [pledgeList, setPledgeList] = React.useState([]);
    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setPledgeList(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleOption = (e) => {
        setOption(e.target.value);;
        setSessionType(e.target.value);
    };




    const [pledges, setPledges] = React.useState([]);
    useEffect(() => {

        Axios.get('http://localhost:3001/viewPledges').then((response) => {
            setPledges(response.data)
        })

    }, []);





    const colNamesPossible = ["Session", "Session Type", "Pledges", "Course", "Date", "Time"];
    let colNames = [];
    let rows = [];
    let sessPledges = [];

    const sessionTypes = ["Test", "Tutorial", "Exam"];
    const [sess, setSess] = React.useState([]);

    useEffect(() => {

        const getSess = async () => {
            const response = await Axios.get('http://localhost:3001/sessions');
            setSessions(response.data);

            for (let i = 0; i < response.data.length; i++) {
                let id = response.data[i].session_id;
                const response2 = await Axios.get('http://localhost:3001/sessionPledges', {
                    params: { "session_id": id }
                });
                const temp1 = [response.data[i].session_id, response2.data];
                setSessionPledges(OldArray => [...OldArray, temp1]);



            }



        }
        getSess();
    }, []);




    const getPledgesBySession = (session) => {
        let pledgeNames = "";
        for (let i = 0; i < sessionPledges.length; i++) {
            if (session == sessionPledges[i][0]) {
                for (let j = 0; j < sessionPledges[i][1].length; j++)
                    pledgeNames += sessionPledges[i][1][j].pledge_name + " ";

            }
        }
        return pledgeNames;

    }

    colNames = colNamesPossible;
    rows = sessions;





    const handleOpen = () => {
        setLabel("Edit");
        setOpen(true);
        setHide(true);
    }



    const handleClose = () => { setOpen(false); }
    const editHandle = async (e) => {
        const response = await editSessions(date, time, sessionName); const response2 = await getSessions(); setSessions(response2.data); const response3 = await getSessionPledges(); setSessionPledges(response3);
        handleClose();
    }
    const addHandle = (e) => { setLabel("Add"); setOpen(true); setHide(false); setDate(""); setTime(""); setCourse(""); setSessionType("") }
    const add = async (e) => {
        const response = await addSessions(course, sessionType, date, time, sessionName, pledgeList); const response2 = await getSessions(); setSessions(response2.data); const response3 = await getSessionPledges(); setSessionPledges(response3); handleClose();
    }
    return (

        <>
            <div className="pageWrapper">
                <div style={{ display: "inline-flex", padding: "10px" }}>
               
                    <TextField 
                    style={{ minWidth: "75%" }}

                        variant='outlined'
                        placeholder='Search...'
                        type='search'
                        onInput={(e) => requestSearch(e.target.value)}
                    />
                
                    <TextField style={{ minWidth: "22%" , paddingLeft: "15px"}}
                        id="outlined-name"
                        select
                        defaultValue={"session_name"}
                        value={filter}
                        onChange={handleFilter}
                        label = "Filter by"
                    >
                        <MenuItem  value={"session_name"}>
                              Sessions
                            </MenuItem>
                            <MenuItem  value={"session_type"}>
                                Session Type
                            </MenuItem>


                      

                    </TextField>
              
                    
                    
                </div>

                <TableContainer component={Paper} id="cT">
                    <Table aria-label="customized table"  >
                        <TableHead>
                            <TableRow >
                                {colNames.map((headerItem, index) => (
                                    <StyledTableCell key={index}>{headerItem}</StyledTableCell>
                                ))}
                            </TableRow>

                        </TableHead>
                        <TableBody>
                            {Object.values((copyList.length > 0 ? copyList : sessions)).map((obj, index) => (
                                <StyledTableRow key={index} onClick={() => { handleOpen(); sessionStorage.setItem("session_id", [obj["session_id"]]); setCourse(obj["course_id"]); setSessionType(obj["session_type"]); setDate(obj["date"]); setTime(obj["time"]); console.log(index); setSessionName(obj["session_name"]) }} hover={true}>

                                    <StyledTableCell  >{obj["session_name"]}</StyledTableCell>
                                    <StyledTableCell >{obj["session_type"]}</StyledTableCell>
                                    <StyledTableCell>{getPledgesBySession(obj["session_id"])}</StyledTableCell>
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

                            {!hide && (<TextField
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
                                {sessionTypes.map((option, index) => (

                                    <MenuItem key={index} value={option} >
                                        {option}
                                    </MenuItem>


                                ))}


                            </TextField>)}
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    sx={{ width: "90%" }}
                                    label="Select Date"
                                    value={date}
                                    onChange={(newValue) => {
                                        setDate(newValue);
                                    }}
                                    renderInput={(params) => <TextField sx={{ width: "90%" }} {...params} />}
                                />
                            </LocalizationProvider>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <TimePicker
                                    label="Select Time"
                                    value={time}
                                    onChange={(newValue) => {
                                        setTime(newValue);
                                    }}
                                    renderInput={(params) => <TextField sx={{ width: "90%" }}  {...params} />}
                                />
                            </LocalizationProvider>
                            {!hide && (<InputLabel id="demo-multiple-name-label">Select Pledges</InputLabel>)}
                            {!hide && (<Select
                                sx={{ paddingTop: "5px", width: "90%" }}
                                labelId="demo-multiple-name-label"
                                id="demo-multiple-name"
                                multiple
                                value={pledgeList}
                                onChange={handleChange}
                                input={<OutlinedInput label="Select Pledges" />}
                                MenuProps={MenuProps}
                            >
                                {pledges.map((pledge) => (
                                    <MenuItem
                                        key={pledge.id}
                                        value={pledge["pledge_id"]}

                                    >
                                        {pledge.pledge_name} ({pledge.pledge_type})
                                    </MenuItem>
                                ))}
                            </Select>)}




                            <div style={{ display: "inline-flex" }}>
                                {hide && (<Button variant="contained" sx={{ marginRight: "10px" }} onClick={editHandle} >Update</Button>)}
                                {!hide && (<Button variant="contained" sx={{ marginRight: "10px" }} onClick={add}  >Add</Button>)}
                                <Button style={{ bottom: "-5%" }} onClick={handleClose}>Cancel</Button>
                            </div>
                        </Stack>

                    </Box>
                </Modal>

            </div>
        </>
    );
}
