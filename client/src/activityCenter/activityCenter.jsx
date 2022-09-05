import React from "react";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import "./activityCenter.css"
import Divider from '@mui/material/Divider';
import image from "./633816.png"

import { IconButton } from '@mui/material';
import { Card } from "@mui/material";
import { CardContent } from "@mui/material";
import { useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import Badge from '@mui/material/Badge';
import { setTemplateEngine } from "@syncfusion/ej2-base";
import { act } from "react-dom/test-utils";





async function getActions(userID) {
    const result = await Axios({
        method: "get",
        url: "http://localhost:3001/myActions",
        params: { 'studentID': userID }
    });
    return result.data;
}

async function postAction(actionID) {
     return Axios.post("http://localhost:3001/viewAction", {
        actionID: actionID
    });
}

export default function ActivityCenter() {


    const [activities, setActivities] = React.useState([]);
    let navigate = useNavigate();
    useEffect(() => {
        const fetchData= async () => {
            console.log("called")
            const result = await getActions(sessionStorage.getItem("user_id"));
            setActivities(result);
        }
        fetchData().catch(console.error);
    }, []
    );


    const open = async (row, idx) => {
        // setActivities(activities.splice(idx, 1)); 


        console.log("before post");
        const post = await postAction(row["action_id"]);
        console.log("after post", post);
        const response = await getActions(sessionStorage.getItem("user_id"));
        console.log("setting new activities")
        setActivities(response);
        console.log(activities);

        if (row["tables"] == "meeting" || row["tables"] == "logged_offences" || row["tables"] == "logged_offence") {
            sessionStorage.setItem("ticket_id_student", row["table_id"]);

            navigate("/MyTickets");
        } else if (row["tables"] == "sessions") {

            navigate("/MySessions");
        }

    }




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
            sx={{ width: anchor === 'top' || anchor === 'bottom'? 'auto' : window.innerWidth*0.2, alignSelf: "center", justifyContent: "center", alignItems: "center" }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >

            <h1 style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>Notifications</h1>
            {activities.map((activity, idx) => (
                <Card id={idx} raised sx={{ width: "80%", height: "175px", marginTop: "15px", textAlign: "center", marginLeft: "7.25%" }}>
                    <CardContent>
                        <p style={{ textAlign: "left", fontFamily: "Arial, Helvetica, sans-serif" }}>{activity["date"]}</p>
                        <p style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>{activity["action_desc"]}</p>
                        <Button onClick={() => open(activity, idx)}>See more</Button>
                    </CardContent>
                </Card>
            ))};


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