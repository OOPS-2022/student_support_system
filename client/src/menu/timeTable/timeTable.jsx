import React, { useEffect, useState } from "react";
import "../page.css"
import { MenuItem, TextField, Button, Box, Typography, Tabs, Tab } from "@mui/material";
import Axios from 'axios';

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


export default function TimeTable() {
  const [day, setDay] = React.useState(0);
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  let days = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
  const [scheduleInfo, setScheduleInfo] = React.useState([]);
  const [scheduleID, setScheduleID] = React.useState(0);
  const [desc, setDesc] = React.useState("");
  const [time, setTime] = React.useState(0);
  const [events, setEvents] = React.useState([]);

  //array for the events of the calander (uses object event)
  class event { //-------------------the class for object event 
    constructor(title, sDate) {
      this.title = title;
      this.allDay = true;
      this.start = new Date(sDate)
      this.end = new Date(sDate);
    }
  }



  React.useEffect(() => {
    const getData = async () => {
    const response = await Axios.post('http://localhost:3001/getScheduleID', {
      userID: sessionStorage.getItem("user_id")
    });
  
    


    const response2 = await Axios.post('http://localhost:3001/getTimeTable', {
      scheduleID: response.data["schedule_id"]
    });
    console.log(response2);
    setScheduleInfo(response2.data);
  
    for(let j = 0; j<response2.data.length; j++){
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
  
     for(let  i= 0; i<dates.length;i++){
       let date = dates[i];
       let e = new event(response2.data[j]["details"], date.toISOString());
       setEvents(OldArray => [...OldArray, e]);
     }

  }
  
}



  getData()}, []);





  let navigate = useNavigate();





  return (
    <div className="pageWrapper">



      <div>
        <Calendar
          localizer={localizer}
          events={events}
          // id = "1"
          startAccessor="start"
          endAccessor="end"
          //   defaultView="week"
          //   views={['week','day','agenda']}
          selectRange={true}
          style={{ height: 500, margin: "50px" }}


        />

      </div>


    </div>
  );
}