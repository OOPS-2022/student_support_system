import React from "react";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import "./activityCenter.css"
import Divider from '@mui/material/Divider';
import image from "./633816.png"

import { Accordion, AccordionDetails, AccordionSummary, IconButton } from '@mui/material';
import { Card } from "@mui/material";
import { CardContent } from "@mui/material";
import { useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import Badge from '@mui/material/Badge';
import { setTemplateEngine } from "@syncfusion/ej2-base";
import { act } from "react-dom/test-utils";
import MenuIcon from '@mui/icons-material/Menu';







async function postAction(actionID) {
    return Axios.post("http://localhost:3001/viewAction", {
        actionID: actionID
    });
}

export default function ActivityCenter() {


    const [activities, setActivities] = React.useState([]);
    const [sessions, setSessions] = React.useState([]);
    const [meetings, setMeetings] = React.useState([]);
    const [offences, setOffences] = React.useState([]);

    let navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            console.log("called")
            const result = await getActions(sessionStorage.getItem("user_id"));
            setActivities(result);
            for (let i = 0; i < Object.keys(result).length; i++) {
                if (result.at(i).tables == "sessions") {
                    setSessions(OldArray => [...OldArray, result.at(i)]);
                }
                if (result.at(i).tables == "meetings") {
                    setMeetings(OldArray => [...OldArray, result.at(i)]);
                }
                if (result.at(i).tables == "logged_offences" || result.at(i).tables == "logged_offence") {
                    setOffences(OldArray => [...OldArray, result.at(i)]);
                }

              
            }
        }
        fetchData().catch(console.error);
    }, []
    );

    async function getActions(userID) {
        const result = await Axios({
            method: "get",
            url: "http://localhost:3001/myActions",
            params: { 'studentID': userID }
        });
        console.log(result.data);
        setActivities(result.data);
        for (let i = 0; i < Object.keys(result.data).length; i++) {
            if (result.data.at(i).tables == "sessions") {
                setSessions(OldArray => [...OldArray, result.data.at(i)]);
            }
            if (result.data.at(i).tables == "meetings") {
                setMeetings(OldArray => [...OldArray, result.data.at(i)]);
            }
            if (result.data.at(i).tables == "logged_offences" || result.data.at(i).tables == "logged_offence") {
                setOffences(OldArray => [...OldArray, result.data.at(i)]);
            }
    
          
        }
        return result.data;
    }

    const open = async (row, idx) => {
  
        console.log("before post");
        const post = await postAction(row["action_id"]);
        console.log("after post", post);
        const response = await getActions(sessionStorage.getItem("user_id"));
        console.log("setting new activities");
        setActivities(response);
        console.log(activities);
      
       


        if (row["tables"] == "meeting" || row["tables"] == "logged_offences" || row["tables"] == "logged_offence") {
            sessionStorage.setItem("ticket_id_student", row["table_id"]);

            navigate("/MyTickets");
        } else if (row["tables"] == "sessions") {

            navigate("/MySessions");
        }

        

    }

    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };


    const [state, setState] = React.useState({
        right: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });

    };

    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : window.innerWidth * 0.2, alignSelf: "center", justifyContent: "center", alignItems: "center" }}
            role="presentation"
        >

            <h1 style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>Notifications</h1>
            

                <Accordion style={{ backgroundColor: "white", color: "black", boxShadow: "false" }} expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                    <AccordionSummary
                       
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        <h3 style={{  paddingLeft: "10%" , fontFamily: "Arial, Helvetica, sans-serif"}}>Sessions</h3>
                    </AccordionSummary>


                    <AccordionDetails>
                    {sessions.map((activity, idx) => (
                    <Card id={idx} raised sx={{ width: "80%", height: "175px", marginTop: "15px", textAlign: "center", marginLeft: "7.25%" }}>
                        <CardContent>
                            <p style={{ textAlign: "left", fontFamily: "Arial, Helvetica, sans-serif" }}>{activity["date"]}</p>
                            <p style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>{activity["action_desc"]}</p>
                            <Button onClick={() => {open(activity, idx);toggleDrawer(anchor, false);}}>See more</Button>
                        </CardContent>
                    </Card>))}

                    </AccordionDetails>
                    </Accordion>

                    <Accordion style={{ backgroundColor: "white", color: "black", boxShadow: "false" }} expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                    <AccordionSummary
                       
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        <h3 style={{  paddingLeft: "10%" , fontFamily: "Arial, Helvetica, sans-serif"}}>Meetings</h3>
                    </AccordionSummary>


                    <AccordionDetails>
                    {meetings.map((activity, idx) => (
                    <Card id={idx} raised sx={{ width: "80%", height: "175px", marginTop: "15px", textAlign: "center", marginLeft: "7.25%" }}>
                        <CardContent>
                            <p style={{ textAlign: "left", fontFamily: "Arial, Helvetica, sans-serif" }}>{activity["date"]}</p>
                            <p style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>{activity["action_desc"]}</p>
                            <Button onClick={() => {open(activity, idx);toggleDrawer(anchor, false);}}>See more</Button>
                        </CardContent>
                    </Card>))}

                    </AccordionDetails>
                    </Accordion>

                    <Accordion style={{ backgroundColor: "white", color: "black", boxShadow: "false" }} expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                    <AccordionSummary
                        
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        <h3 style={{  paddingLeft: "10%" , fontFamily: "Arial, Helvetica, sans-serif"}}>Logged Offences</h3>
                    </AccordionSummary>


                    <AccordionDetails>
                    {offences.map((activity, idx) => (
                    <Card id={idx} raised sx={{ width: "80%", height: "175px", marginTop: "15px", textAlign: "center", marginLeft: "7.25%" }}>
                        <CardContent>
                            <p style={{ textAlign: "left", fontFamily: "Arial, Helvetica, sans-serif" }}>{activity["date"]}</p>
                            <p style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>{activity["action_desc"]}</p>
                            <Button onClick={() => {open(activity, idx); toggleDrawer(anchor, false);}}>See more</Button>
                        </CardContent>
                    </Card>))}

                    </AccordionDetails>
                    </Accordion>
                    
            


                </Box>
            );

            return (
            <div>
                {['right'].map((anchor) => (
                    <React.Fragment key={anchor}>
                        <IconButton className="box" sx={{
                            textAlign: "center",
                            alignItems: "center",
                        }} onClick={toggleDrawer(anchor, true)}><Badge badgeContent={activities.length} color="primary"><img style={{ width: "20px", marginBottom: "4px" }} src={image} /></Badge></IconButton>
                        <Drawer
                            anchor={anchor}
                            open={state[anchor]}
                            onClose={toggleDrawer(anchor, false)}
                        >
                            {list(anchor)}
                        </Drawer>
                    </React.Fragment>
                ))}
            </div>
            );
}