import React, { useEffect, useState } from "react";
import "../page.css"
import { MenuItem, TextField, Button, Box, Typography, Tabs, Tab } from "@mui/material";
import Axios from 'axios';

import "../page.css"
import './calender.css';
import {CalendarComponent} from '@syncfusion/ej2-react-calendars';
import { Calendar, dateFnsLocalizer, momentLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useNavigate } from 'react-router-dom';
import { RRule, RRuleSet, rrulestr } from 'rrule';


const locales ={
    "en-US": require("date-fns/locale/en-US")
  }
  const localizer =dateFnsLocalizer({
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
    let days = ["MO","TU","WE","TH","FR","SA","SU"];
    const [scheduleInfo, setScheduleInfo] = React.useState([]);

    React.useEffect(() => {

        Axios.post('http://localhost:3001/getScheduleID',{
            userID: sessionStorage.getItem("user_id") 
        }).then((response) => {
            setScheduleInfo(response.data);
            setStartDate(response.data["start_date"]);
            setEndDate(response.data["end_date"]);
            console.log(response.data);
        })

    }, []);
    // let dayString = days[day-1];
    // const rule = new RRule({
    //   freq: RRule.WEEKLY, 
    //   byweekday: [RRule.dayString],
    //   dtstart: new Date(startDate),
    //   until: new Date(endDate)
    // });
    
    
  //  const dates = rule.all()
    
    const events=[];//array for the events of the calander (uses object event)
    class event{ //-------------------the class for object event 
      constructor(title,sDate,session_id ){
        this.title = title;
        this.allDay = true;
        this.start = new Date(sDate);
        this.end = new Date(sDate);
        this.session_id = session_id;
      }
    }
  let navigate = useNavigate();

   
  
    // for(var i in prevMeetings){
    //   events.push(new event(prevMeetings[i].session_type,prevMeetings[i].date, prevMeetings[i].session_id) );
    // }
    
    return (
      <div className="pageWrapper">
       
  
       
          <div>
            <Calendar 
              localizer={localizer} 
              events={events}
              // id = "1"
              startAccessor= "start"
              endAccessor= "end"
            //   defaultView="week"
            //   views={['week','day','agenda']}
              selectRange={true}
              style={{height: 500, margin:"50px"}}
              onSelectEvent={(event) =>{
                  sessionStorage.setItem("session_id",event.session_id);
                  navigate("/AddCheckList");
              }}
              minDate={new Date('2022-10-22 08:00:00')}
              maxDate={new Date('2022-10-25 20:00:00')}
            />
  
          </div>
  
  
      </div>
    );
  }