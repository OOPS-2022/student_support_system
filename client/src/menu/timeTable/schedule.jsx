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
import { makeStyles, styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { DateRange, SubwayTwoTone } from "@mui/icons-material";



const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "rgb(79,147,210)",
        fontSize: 20,

    },
    [`&.${tableCellClasses.body}`]: {
        '&:nth-of-type(odd)': {
            backgroundColor: "rgb(147,183,214,0.2)",

        },

        fontSize: 14,
        border: 1
    },
    "&:hover": {
        backgroundColor: "rgba(6, 71, 150, 0.2) !important"
    },
    "&$selected, &$selected:hover": {
        backgroundColor: "purple"
    },



}));






const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: "rgb(147,183,214,0.2)",

    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },


}));
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    height: 360,
    bgcolor: 'background.paper',
    borderRadius: '7px',
    boxShadow: 24,
    p: 4,
    textAlign: "center",
    alignItems: "center"

};




export default function Schedule(props) {
    const weekDays = ["Time", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const Times = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
    const [open, setOpen] = React.useState(false);
    const [weekday, setWeekday] = React.useState(-1);
    const [description, setDescription] = React.useState("");
    const [time, setTime] = React.useState("");
    const [timeKey, setTimeKey] = React.useState(-1);
    const [submitted, setSubmitted] = React.useState(false);
    const [scheduleID, setScheduleID] = React.useState(0);
    const [scheduleInfo, setScheduleInfo] = React.useState([]);
    let date ="";
    const [eventDays, setEventDays] = React.useState([[0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0]]);
    const [timeInt, setTimeInt] = React.useState(0);
    const [dayInt, setDayInt] = React.useState(0);
    const [desc, setDesc] = React.useState("");


    const getData = async () => {
        const response = await Axios.post('http://localhost:3001/getScheduleID', {
          userID: sessionStorage.getItem("user_id")
        });
  
        const response2 = await Axios.post('http://localhost:3001/getTimeTable', {
          scheduleID: response.data["schedule_id"]
        });
        setScheduleID(response.data["schedule_id"]);
        setScheduleInfo(response2.data);
        for(let i = 0; i < response2.data.length;i++){
            let t = response2.data[i]["time"]-8;
            let d = response2.data[i]["weekday"]-1;
            eventDays[d][t] = response2.data[i]["details"];
            setDesc(response2.data[i]["details"]);
        
            

        }
        console.log(eventDays);

    }
    

    
    useEffect(() => {

        getData();

    }, []);


    const handleOpen = () => {
        setOpen(true);

    }

    const edit = async () => {
            date = new Date();
            let timeStamp;
            let f = time[0];
            if(f == 0){
                 timeStamp = time[1];
            }else{
                let s = time[1];
                timeStamp = f;
                timeStamp += s;
            }
            let tS = parseInt(timeStamp);
        const response = await Axios.post('http://localhost:3001/changeTimeTableEntry', {
          scheduleID: scheduleID,
          day: weekday,
          time: tS,
          desc: desc
        });
        getData();
        handleClose();
      }



    const handleClose = () => { setOpen(false); }
    return (
        <><div >
            <div style={{ backgroundColor: "rgb(79,147,210,0.1)", padding: "15px", borderRadius: "7px" }}>
                <h1>View Schedule</h1>
                <TableContainer component={Paper} id="cT">
                    <Table sx={{ minWidth: 500 }} aria-label="customized table">
                        <TableHead>
                            <TableRow >
                                {weekDays.map((headerItem, index) => (

                                    <StyledTableCell

                                        align="center" > {headerItem}</StyledTableCell>


                                ))}

                            </TableRow>


                        </TableHead>
                        <TableBody>
                            {Times.map((obj, index) => (

                                <StyledTableRow  >
                                    <StyledTableCell align="center" minWidth={"100%"} style={{ fontSize: "18px", fontWeight: "bold" }}>{obj}</StyledTableCell>
                                    <StyledTableCell onClick={() => { if(eventDays[0][index] != 0){handleOpen(); setWeekday(1); setTime(obj); setTimeKey(index);}}} key={1}>{eventDays[0][index] != 0 && (<h3>{eventDays[0][index] }</h3>)}</StyledTableCell>
                                    <StyledTableCell onClick={() => { if(eventDays[1][index] != 0){handleOpen(); setWeekday(2); setTime(obj); setTimeKey(index);}}} key={2}>{eventDays[1][index] != 0 && (<h3>{eventDays[1][index] }</h3>)}</StyledTableCell>
                                    <StyledTableCell onClick={() => { if(eventDays[2][index] != 0){handleOpen(); setWeekday(3); setTime(obj); setTimeKey(index);}}} key={3}>{eventDays[2][index] != 0 && (<h3>{eventDays[2][index] }</h3>)}</StyledTableCell>
                                    <StyledTableCell onClick={() => { if(eventDays[3][index] != 0){handleOpen(); setWeekday(4); setTime(obj); setTimeKey(index);}}} key={4}>{eventDays[3][index] != 0 && (<h3>{eventDays[3][index] }</h3>)}</StyledTableCell>
                                    <StyledTableCell onClick={() => { if(eventDays[4][index] != 0){handleOpen(); setWeekday(5); setTime(obj); setTimeKey(index);}}} key={5}>{eventDays[4][index]!= 0 && (<h3>{eventDays[4][index] }</h3>)}</StyledTableCell>
                                    <StyledTableCell onClick={() => { if(eventDays[5][index] != 0){handleOpen(); setWeekday(6); setTime(obj); setTimeKey(index);}}} key={6}>{eventDays[5][index]!= 0 && (<h3>{eventDays[5][index] }</h3>)}</StyledTableCell>
                                    <StyledTableCell onClick={() => { if(eventDays[6][index] != 0){handleOpen(); setWeekday(7); setTime(obj); setTimeKey(index);}}} key={7}>{eventDays[6][index]!= 0 && (<h3>{eventDays[6][index] }</h3>)}</StyledTableCell>

                                </StyledTableRow>

                            ))}


                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

        </div>
        <div>
        <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack direction="column" spacing={2} sx={{ justifyContent: "center", alignItems: "center" }}>
          <h1>{time} on {weekDays[dayInt-1]}</h1>
            <h1>Details of event:</h1>
            <TextField label={desc} style={{ minWidth: "90%" }}
              onChange={(e) => {
                setDesc(e.target.value);


              }} ></TextField>
            
            <Button onClick={edit}>Edit</Button>
            <Button onClick={handleClose}>Close</Button>

          </Stack>

        </Box>
      </Modal >
      </div>
    </>
        
    )

}
