import React, { useEffect, useState } from "react";
import "../page.css"
import { MenuItem, TextField, Button, Box, Typography, Tabs, Tab, ButtonGroup } from "@mui/material";
import Axios from 'axios';
import "./timeTable.css"

import "../page.css"
import './calender.css';
import { CalendarComponent } from '@syncfusion/ej2-react-calendars';
import { Calendar, dateFnsLocalizer, momentLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useNavigate } from 'react-router-dom';
import { RRule, RRuleSet, rrulestr } from 'rrule';
import { Stack, Modal } from "@mui/material";
import Entry from "./entry";
import { borderRadius } from "@mui/system";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarToolbar from "./customToolbar";
import CustomHeader from "./customHeader";
import { BorderColor } from "@mui/icons-material";
 


const locales = {
  "en-US": require("date-fns/locale/en-US")
}
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  height: 500,
  bgcolor: 'background.paper',
  borderRadius: '7px',
  boxShadow: 24,
  p: 4,
  textAlign: "center",
  alignItems: "center"

};

function dayStyleGetter(day){
  var style ={
    backgroundColor: "rgb(79,147,210,0.5)",
    borderRadius: "2px",
    BorderColor: "white",
    color: "white",
    padding: "15px"
  }
  return {
    style: style
  }
}

function eventStyleGetter(event, start, end, isSelected) {
  var backgroundColor = '#' + event.hexColor;
  var style = {
      backgroundColor: "rgb(21,30,166)",
      borderRadius: '1px',
      opacity: 1,
      color: 'white',
      border: '10px',
      display: 'block',
      textAlign: "center",
      padding: "5px",
      fontFamily : "Sans-serif",
  };
  return {
      style: style
  };
}




export default function TimeTable() {
  const [day, setDay] = React.useState(0);
  const [timeInt, setTimeInt] = React.useState(0);
  const [dayInt, setDayInt] = React.useState(0);
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  let days = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
  const [scheduleInfo, setScheduleInfo] = React.useState([]);
  const [scheduleID, setScheduleID] = React.useState(0);
  const [desc, setDesc] = React.useState("");
  const [time, setTime] = React.useState(0);
  const [events, setEvents] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const Times = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];


  //array for the events of the calander (uses object event)
  class event { //-------------------the class for object event 
    constructor(title, sDate, time, weekday,dayInt, timeInt) {
      this.title = title;
      this.allDay = true;
      this.start = new Date(sDate)
      this.end = new Date(sDate),
      this.time = time,
      this.weekday = weekday,
      this.dayInt = dayInt,
      this.timeInt = timeInt
    }
  }
  const getData = async () => {
    const response = await Axios.post('http://localhost:3001/getScheduleID', {
      userID: sessionStorage.getItem("user_id")
    });




    const response2 = await Axios.post('http://localhost:3001/getTimeTable', {
      scheduleID: response.data["schedule_id"]
    });
    setScheduleID(response.data["schedule_id"]);
    console.log(response2);
    setScheduleInfo(response2.data);

    for (let j = 0; j < response2.data.length; j++) {
      const rule = new RRule({
        freq: RRule.WEEKLY,
        byweekday: days[response2.data[j]["weekday"] - 1],
        dtstart: new Date(response.data["start_date"]),
        until: new Date(response.data["end_date"]),
        byhour: [response2.data[j]["time"]]

      });
      console.log(rule);
      const dates = rule.all();
      console.log(dates);
      let timeString = parseInt(response2.data[j]["time"]);
      if(response2.data[j]["time"]< 13){
        timeString += " am";
      }else{
        timeString += " pm";
      }
      for (let i = 0; i < dates.length; i++) {
        let date = dates[i];
        let e = new event(response2.data[j]["details"], date.toISOString(), timeString, weekDays[response2.data[j]["weekday"]-1],response2.data[j]["weekday"],response2.data[j]["time"] );
        setEvents(OldArray => [...OldArray, e]);
      }

    }

  }



  React.useEffect(() => {
    getData();
  }, []);





  let navigate = useNavigate();
  const handleOpen = () => {
    setOpen(true);

  }



  const handleClose = () => { setOpen(false); }
  const [option, setOption] = React.useState("");


  const edit = async () => {
    const response = await Axios.post('http://localhost:3001/changeTimeTableEntry', {
      scheduleID: scheduleID,
      day: dayInt,
      time: timeInt,
      desc: desc
    });
    handleClose();
    setEvents([]);
    getData();
  }

 

  return (
    <div className="pageWrapper">



      <div style ={{fontFamily: "Sans-serif", padding: "15px"}}>
        <Calendar 
          style = {{height: "80vh", fontFamily: "Sans-serif", fontWeight: "2px", padding: "15px"}}
          localizer={localizer}
          events={events}
          // id = "1"
          startAccessor="start"
          endAccessor="end"
          eventPropGetter={(eventStyleGetter)}
          dayPropGetter ={(dayStyleGetter)}
          components={{
            toolbar: CalendarToolbar,
            header: CustomHeader
          }}
          onSelectEvent={(event) => {
            setTime(event.time);
            setDesc(event.title);
            setOpen(true);
            setTimeInt(event.timeInt);
            setDayInt(event.dayInt);
          }}

        />

      </div>

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
    </div >
  );
}