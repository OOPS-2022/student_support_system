import React, { useEffect, useState } from "react";
import "../page.css"
import { MenuItem, TextField, Button, Box, Typography, Tabs, Tab } from "@mui/material";
import Axios from 'axios';
import PropTypes from 'prop-types';
import "./oi.css";
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


//these are used to set up the big calendar - MY CALENDAR tab
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


function TabPanel(props) {

  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};


export default function OI() {
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
  
  //gets all the previous meetings scheduled from the database
  const [prevMeetings,setPrevMeetings] = useState([])
  useEffect(() => {
    Axios.get('http://localhost:3001/getAllSessions').then((response) => {
      setPrevMeetings(response.data);
      
    })
  }, []);

  for(var i in prevMeetings){
    console.log("date:"+prevMeetings[i].date);
    events.push(new event(prevMeetings[i].session_type,prevMeetings[i].date, prevMeetings[i].session_id) );
  }
  
  

//   const [meeting, setMeeting] = React.useState(null);
  const [value, setValue] = React.useState(0);
//   const [fileUpload, setFileUpload] = React.useState();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  


  return (
    <div className="pageWrapper">
     

     
        <div>
          <h1>Pick A Session</h1>
          <Calendar 
            localizer={localizer} 
            events={events}
            // id = "1"
            startAccessor="start" 
            endAccessor="end" 
            style={{height: 500, margin:"50px"}}
            onSelectEvent={(event) =>{
                sessionStorage.setItem("session_id",event.session_id);
                navigate("/AddCheckList");
            }}
          />

        </div>


    </div>
  );
}