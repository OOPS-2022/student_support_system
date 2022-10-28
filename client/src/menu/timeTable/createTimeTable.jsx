import { Button, TextField } from "@mui/material";
import { Stack } from "@mui/material";
import React from "react";
import "../page.css";
import Axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Modal, Box } from "@mui/material";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    height: 350,
    bgcolor: 'background.paper',
    borderRadius: '7px',
    boxShadow: 24,
    p: 4,
    textAlign: "center",
    alignItems: "center"

};

async function createSchedule(start, end) {
    return Axios.post("http://localhost:3001/createSchedule", {
        userID: sessionStorage.getItem("user_id"),
        startDate: start.toLocaleDateString("fr-CA"),
        endDate: end.toLocaleDateString("fr-CA")
    });
}

export default function CreateTimeTable() {
    let navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [startDate, setStartDate] = React.useState(new Date());
    const [endDate, setEndDate] = React.useState(new Date());
    const [scheduleID, setScheduleID] = React.useState(0);
    const [isCreated, setIsCreated] = React.useState(false);

    React.useEffect(() => {

        Axios.post('http://localhost:3001/getScheduleID',{
            userID: sessionStorage.getItem("user_id") 
        }).then((response) => {
            setScheduleID(response.data["schedule_id"]);
            console.log(response.data["schedule_id"]);
            if(response.data == ""){
                setIsCreated(false);
            }else{
                setIsCreated(true);
            }
        })

    }, []);

    const handleOpen = () => {
        setOpen(true);

    }

    



    const handleClose = () => { setOpen(false); }
    const setDates = () => {
        setOpen(true);
    }
    const create = async () => {
        const result = createSchedule(startDate, endDate);
        navigate("/WeekTable");
    }
    const view = async () => {
        navigate("/Schedule");
    }

    return (
        <>
            <div>
                <Stack direction="column" spacing={3} sx={{ justifyContent: "center", alignItems: "center", marginTop: "15%" }}>
                   {isCreated && (<Button variant="contained" onClick={view}>View Time Tables</Button>)}
                   {!isCreated && (<h1>OOPS! Seems like you don't have a schedule yet</h1>)}
                   {!isCreated && (<h1>Would you like to create one?</h1>)}
                   {!isCreated && (<Button variant="contained"  onClick={setDates}>Create New Time Table</Button>)}
                </Stack>
            </div>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Stack direction="column" spacing={2} sx={{ justifyContent: "center", alignItems: "center" }}>
                        <h1>Select start date</h1>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                sx={{ width: "90%" }}
                                label="Select Date"
                                value={startDate}
                                onChange={(newValue) => {
                                    setStartDate(new Date(newValue));
                                }}
                                renderInput={(params) => <TextField sx={{ width: "90%" }} {...params} />}
                            />
                        </LocalizationProvider>

                        <h1>Select end date</h1>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                sx={{ width: "90%" }}
                                label="Select Date"
                                value={endDate}
                                onChange={(newValue) => {
                                    setEndDate(new Date(newValue));
                                }}
                                renderInput={(params) => <TextField sx={{ width: "90%" }} {...params} />}
                            />
                        </LocalizationProvider>


                        <Button onClick = {create}>Continue</Button>

                    </Stack>

                </Box>
            </Modal>
        </>



    );
}