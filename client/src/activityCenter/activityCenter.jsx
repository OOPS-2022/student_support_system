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





export default function ActivityCenter() {

  
    let navigate = useNavigate();

    const [activities, setActivities] = React.useState([]);
    const [table, setTable] = React.useState("");
    const [tableID, setTableID] = React.useState("");
    const [actionID, setActionID] = React.useState("");

    useEffect(() => {
        Axios.get("http://localhost:3001/myActions", {
           params: { 'studentID': sessionStorage.getItem("user_id") }
       }).then((res) => {
       setActivities(res.data);
       })
    },[]
   );

   const open = (event) =>{
    console.log(sessionStorage.getItem("action_id"));
    Axios.post("http://localhost:3001/viewAction", {
        actionID: sessionStorage.getItem("action_id")}).then((res) => {
            alert(res.data);
            });
        
     if(table=="meetings" || table =="logged_offences"){
         sessionStorage.setItem("ticket_id_student", tableID);
         navigate("/MyTickets");
     }
     if(table =="sessions"){
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
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 400 , alignSelf:"center",justifyContent: "center",alignItems: "center"}}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
          >
        
            <h1 style ={{fontFamily:"Arial, Helvetica, sans-serif"}}>Notifications</h1>
            {activities.map((activity) =>(
                <Card raised sx={{width:"350px",height:"175px",marginTop:"15px", textAlign: "center", marginLeft:"7.25%"}}>
                <CardContent>
                    <p style={{textAlign:"left",fontFamily:"Arial, Helvetica, sans-serif"}}>{activity["date"]}</p>
                    <p style ={{fontFamily:"Arial, Helvetica, sans-serif"}}>{activity["action_desc"]}</p>
                    <Button onClick={() => { open(); setTable(activity["tables"]); setTableID(activity["table_id"]); sessionStorage.setItem("action_id",(activity["action_id"]));}}>See more</Button> 
                </CardContent>
                </Card>
            ))};


        </Box>
    );

    return (
        <div>
            {['right'].map((anchor) => (
                <React.Fragment key={anchor}>
                    <IconButton className ="box"sx={{
                        textAlign: "center",
                        alignItems: "center",
                    }} onClick={toggleDrawer(anchor, true)}><Badge badgeContent={activities.length} color="primary"><img style = {{width:"20px", marginBottom: "4px"}}src ={image} /></Badge></IconButton>
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