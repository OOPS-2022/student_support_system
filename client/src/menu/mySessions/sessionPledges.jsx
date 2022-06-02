
import React from "react";
import "../page.css";
import { Stack, Modal, MenuItem, TextField, Button, Card, CardActionArea, CardMedia, CardContent, Typography, CardActions } from "@mui/material";
import Axios from 'axios';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Label from "../label";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { scryRenderedDOMComponentsWithClass } from "react-dom/test-utils";
import { fontFamily } from "@mui/system";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    height: 650,
    bgcolor: 'background.paper',
    borderRadius: '7px',
    boxShadow: 24,
    p: 4,
    textAlign: "center",
    alignItems: "center",
    fontFamily:"Arial, Helvetica, sans-serif"

};


export default function SessionPledges() {
    const [open, setOpen] = React.useState(false);
    const [sessionPledges, setSessionPledges] = React.useState([]);
    const [pledge, setPledge] = React.useState("");
    const [paragraph, setParagraph] = useState("");
    const [file, setFile] = useState({}); //file uploaded by student if signed pledge
    const [message, setMessage] = useState(""); //the plege message if clicked pledge
    const [type, setType] = useState(""); //type of pledge
    const [checked, setChecked] = useState("");


    const validate = () => {
        if (paragraph == "") {
            alert("Please give a description of your undestanding.");
            return false;
        }
        if (file == null) {
            alert("Please upload a file");
            return false;
        }
        return true;
    }

    const check = () => {
        setChecked(true);
    }

     async function viewPledge(pledgeID) {
        const response = await Axios('http://localhost:3001/sessionPledgeLink', {
            method: 'GET',
            responseType: 'blob', //Force to receive data in a Blob Format
            params: { 'pledge_id': pledgeID }
        });
                //Create a Blob from the PDF Stream
                const file = new Blob(
                    [response.data],
                    { type: 'application/pdf' });
                console.log(response)
                //Build a URL from the file
                const fileURL = URL.createObjectURL(file);
                //Open the URL on new Window
                window.open(fileURL);
    }
    //Only if have to upload signed plegde
    const fileChange = (event) => {
        setFile(event.target.files[0]);
    };

    //uploading signed pledge
    const upload = (pledgeID) => {
        if (validate()) {
            let formData = new FormData();
            formData.append("file", file);
            formData.append("paragraph", paragraph);
            formData.append("sessionID", sessionStorage.getItem("mysession_id"));
            formData.append("studentID", sessionStorage.getItem("user_id")); //hardcoded for now. Get id from user login
            formData.append("pledgeID", pledgeID); //also hardcoded for now
            fetch("http://localhost:3001/submitSession", {
                method: "post",
                body: formData
            })
        }
    };

    //raw html code to embed onto do test if there is a clicked pledge
    const rawHTML = `
       <div>
         <label>
         <input type="checkbox" id="myCheck">
         `+ message + `</label>
         <div>
         </div>
       </div>
       `;


    let navigate = useNavigate();
    useEffect(() => {

        let id = sessionStorage.getItem("mysession_id");
        Axios.get('http://localhost:3001/sessionPledges', {
            params: { "session_id": id }
        }).then(response => {
            console.log(response.data);
            setSessionPledges(response.data);
        }
        );
    }, []);
    const handleOpen = () => {
        setOpen(true);
    }



    const handleClose = () => { setOpen(false); }


    return (
        <div className="pageWrapper">
            <div>
                <h1>Session</h1>
                <h1>Pledges To Do</h1>
                {Object.values(sessionPledges).map((pledge, index) =>
                <div>
                    <Button onClick={() => { setPledge(pledge); handleOpen(); }} variant="text" key={index}>{pledge.pledge_name}({pledge.pledge_type})</Button>
                    </div>
                )}
            </div>
            <div>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Stack direction="column" spacing={2} sx={{ justifyContent: "center", alignItems: "center" }}>
                            <h1>{pledge["pledge_name"]}</h1>
                            <label>Please write a paragraph to show your understanding of the pledge:</label>
                            <br></br>
                            <textarea id="story" name="story" rows="5" cols="33" onChange={(e) => setParagraph(e.target.value)} />
                            <br></br>
                            {!(pledge["pledge_type"]=="Clicked Pledge") && (<label>Please upload your signed pledge here:</label>)}
                            {!(pledge["pledge_type"]=="Clicked Pledge") && ( <br></br>)}
                            {!(pledge["pledge_type"]=="Clicked Pledge") && ( <input type="file" onChange={fileChange} />)}
                            {!(pledge["pledge_type"]=="Clicked Pledge") && (<br></br>)}
                            {!(pledge["pledge_type"]=="Clicked Pledge") && (<Button variant = "contained" onClick={() => {upload(pledge["pledge_id"])}} >upload</Button>)}
                            {!(pledge["pledge_type"]=="Clicked Pledge") && (<Button variant = "contained" onClick={() => { viewPledge(pledge["pledge_id"]);}}>View pledge</Button>)}
                            {(pledge["pledge_type"]=="Clicked Pledge") && (<div dangerouslySetInnerHTML={{ __html: rawHTML }}></div>)}
                            <Button  onClick = {handleClose} variant = "text">Done</Button>
                            <Button onClick = {handleClose} variant = "text">Cancel</Button>
                        </Stack>

                    </Box>
                </Modal>

            </div>
        </div>




    );

}