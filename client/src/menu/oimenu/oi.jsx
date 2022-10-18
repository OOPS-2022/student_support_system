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

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
export default function OI() {
  const events=[];//array for the events of the calander (uses object event)
  class event{ //-------------------the class for object event 
    constructor(title,sDate){
      this.title = title;
      this.allDay = true;
      this.start = new Date(sDate);
      this.end = new Date(sDate);
    }
  }
  
  //gets all the previous meetings scheduled from the database
  const [prevMeetings,setPrevMeetings] = useState([])
  useEffect(() => {
    Axios.get('http://localhost:3001/getAllMeetings').then((response) => {
      setPrevMeetings(response.data)
    })
  }, []);

  for(var i in prevMeetings){
    events.push(new event(prevMeetings[i].meetLink,prevMeetings[i].meetDate));
  }
  
  
  const handleChangeFile = (e) => { //handle change for uploading file
    setFile(e.target.files[0]);
    setLabel(e.target.files[0].name);

    // console.log(e.target.files[0]);
    // localStorage.setItem("pdf", e.target.files[0].url) ;
  };
  const [meeting, setMeeting] = React.useState(null);
  const [value, setValue] = React.useState(0);
  const [fileUpload, setFileUpload] = React.useState("");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  //used to populate the drop-downbox for update ticket tab 
  const Status = ["Not Guilty", "Guilty", "Pending"];
  //set the start date for meetings that can be booked - tab SHEDULE MEETING
  const startDate = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate());
  //set the start end date for meetings that can be booked - tab SHEDULE MEETING
  const endDate = new Date(new Date().getFullYear()+1,new Date().getMonth(),new Date().getDate());
  //gets the calander date from tab SHEDULE MEETING
  const [calDate,setcalDate] = React.useState(new Date());

  //------------------------------makes digit to become two digits - tab SHEDULE MEETING
  function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }
  //------------------------------formates date yyyy-mm-dd - tab SHEDULE MEETING
  function formateDate(date){
    return[
      padTo2Digits(date.getFullYear()),
      padTo2Digits(date.getMonth()+1),
      padTo2Digits(date.getDate()),
    ].join('-');
  }

  
  const [outcome, setOutcome] = React.useState("");
  const handleOutcome = (e) => {
    setOutcome(e.target.value);
  };
  const [file, setFile] = React.useState("");
  const [fileLabel, setLabel] = React.useState("");
  const viewPDF = (e) => {
    //Build a URL from the file
    const fileURL = URL.createObjectURL(file);
    console.log(fileURL);
    //Open the URL on new Window
    window.open(fileURL);
  }
  //Upload evidence files - Update Ticket tab
  const upload = (e) => {
    setFileUpload(file);
    if (file != "") {
      let formData = new FormData();
      formData.append("file", file);
      formData.append("ticket_id", sessionStorage.getItem("ticket_id"));
      console.log(formData);
      fetch("http://localhost:3001/UploadEvidence", {
        method: "post",
        body: formData
      })
    }
  };

  //update status - change to Guilty/Not Guilty and Pending and sends email to notify of change made
  const updateStatus = async () => {
    const response = await Axios.post("http://localhost:3001/updateOI", {
      ticket_id: sessionStorage.getItem("ticket_id"),
      offence_status: outcome,
    })
    const responseStatus = await Axios.post("http://localhost:3001/sendUpdateEmail", {
      ticket_id: sessionStorage.getItem("ticket_id"),
      status: outcome,
      stdNo: sessionStorage.getItem("user_id")
    })
  }

  //used for Sheduling a meeting and sends email to notify of meeting made
  const schedule = async () => {
    events.push(new event(meeting,formateDate(calDate)));
    console.log(events);
    const response = Axios.post("http://localhost:3001/insertOI", {
      studNo: sessionStorage.getItem("studentNumber"),
      meetDate: formateDate(calDate),
      meetLink: meeting,
      ticket_id: sessionStorage.getItem("ticket_id")
    })
    const responseEmail = Axios.post("http://localhost:3001/sendMeetEmail", {
      stdNo: sessionStorage.getItem("studentNumber"),
      meetDate: formateDate(calDate),
      meetLink: meeting,
      token: sessionStorage.getItem("accessToken")
    })
    window.location.reload(1);
  }

  return (
    <div className="pageWrapper">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Schedule Meeting"></Tab>
          <Tab label="Update Ticket"></Tab>
          <Tab label="My Calendar"></Tab>

        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        {
          <div className="oiForm">
            <h1>Schedule a meeting with student {sessionStorage.getItem("studentNumber")} for ticket {sessionStorage.getItem("ticket_id")}:</h1>
            <CalendarComponent onChange={(e) => {
                setcalDate(e.target.value);
              }} min={startDate} max={endDate}
            />
            <TextField label="Link to meeting:"
              style={{ minWidth: "300px" }}
              onChange={(e) => {
                setMeeting(e.target.value);
              }}
            />

            <Button variant="contained" onClick={schedule}>Schedule</Button>
          </div>}

      </TabPanel>
      <TabPanel value={value} index={1}>

        {
          <div>
            <h1>Update offence outcome:</h1>
            <TextField style={{ minWidth: "250px" }}
              id="outlined-name"
              label="Offence outcome"
              select
              value={outcome}
              onChange={handleOutcome}
            >
              {Status.map((outcome, index) => (

                <MenuItem value={outcome}>
                  {outcome}
                </MenuItem>


              ))}

            </TextField>
            <div>
              <Button variant="contained" onClick={updateStatus} sx={{ marginTop: "15px" }}>Change</Button>
            </div>
            <div>
              <h1>Upload Supporting Documents:</h1>
            </div>
            <div>
            <Button
            variant="contained"
            component="label"
          >
            Upload Documents
            <input
              type="file"
              name="file"
              hidden
              onChange={handleChangeFile}
            />
          </Button>
          <Button variant="text" onClick={viewPDF}>{fileLabel}</Button>
          <Button variant="text" onClick={upload} >Submit</Button>
            </div>
          </div>
        }
      </TabPanel>
      <TabPanel value={value} index={2}>
        <div>
          <h1>All Scheduled Meetings</h1>
          <Calendar 
            localizer={localizer} 
            events={events}
            startAccessor="start" 
            endAccessor="end" 
            style={{height: 500, margin:"50px"}}
          />

        </div>
      </TabPanel>

    </div>
  );
}