import React from "react";
import "../page.css"
import { MenuItem, TextField, Button, Box, Typography, Tabs, Tab } from "@mui/material";
import Axios from 'axios';
import PropTypes from 'prop-types';
import "./oi.css";
import "../page.css"

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
  const [meeting, setMeeting] = React.useState(null);
  const [value, setValue] = React.useState(0);
  const [fileUpload, setFileUpload] = React.useState();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [day, setDay] = React.useState("");
  const [year, setYear] = React.useState("");
  const [Month, setMonth] = React.useState("");

  const Months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  const Status = ["Not Guilty", "Guilty", "Pending"];

  const [option, setOption] = React.useState("");
  const handleOption = (e) => {
    setOption(e.target.value);
    setMonth(e.target.value);
  };
  const [outcome, setOutcome] = React.useState("");
  const handleOutcome = (e) => {
    setOutcome(e.target.value);
  };

  const upload = (e) => {
    setFileUpload(e.target.files[0]);
    if (fileUpload != "") {
      let formData = new FormData();
      formData.append("file", fileUpload);
      formData.append("ticket_id", localStorage.getItem("ticket_id"));
      console.log(formData);
      fetch("http://localhost:3001/UploadEvidence", {
        method: "post",
        body: formData
      })
    }
  };

  const updateStatus = async () => {
    const response = await Axios.post("http://localhost:3001/updateOI", {
      ticket_id: localStorage.getItem("ticket_id"),
      offence_status: outcome,
    })
    const responseStatus = await Axios.post("http://localhost:3001/sendUpdateEmail", {
      ticket_id: localStorage.getItem("ticket_id"),
      status: outcome,
      stdNo: localStorage.getItem("studentNumber")
    })
  }
  const schedule = async () => {
    const response = Axios.post("http://localhost:3001/insertOI", {
      studNo: localStorage.getItem("studentNumber"),
      meetDate: year + "-" + Month + "-" + day,
      meetLink: meeting,
      ticket_id: localStorage.getItem("ticket_id")
    })
    const responseEmail = Axios.post("http://localhost:3001/sendMeetEmail", {
      stdNo: localStorage.getItem("studentNumber"),
      meetDate: year + "-" + Month + "-" + day,
      meetLink: meeting,
    })
  }

  return (
    <div className="pageWrapper">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Schedule Meeting"></Tab>
          <Tab label="Update Ticket"></Tab>

        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        {
          <div className="oiForm">
            <h1>Schedule a meeting with student {localStorage.getItem("studentNumber")} for ticket {localStorage.getItem("ticket_id")}:</h1>
            <TextField label="Day"
              style={{ minWidth: "250px" }}
              onChange={(e) => {
                setDay(e.target.value);
              }}
            />

            <TextField style={{ minWidth: "250px" }}
              id="outlined-name"
              label="Month"
              select
              value={option}
              onChange={handleOption}
            >
              {Months.map((option, index) => (

                <MenuItem value={option}>
                  {option}
                </MenuItem>


              ))}

            </TextField>
            <TextField label="Year"
              style={{ minWidth: "250px" }}
              onChange={(e) => {
                setYear(e.target.value);
              }}
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
                  onChange={upload}
                />
              </Button>
            </div>
          </div>
        }
      </TabPanel>

    </div>
  );
}