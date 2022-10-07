
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import "./login.css"
import { listClasses, Stack, stepClasses, TextField } from '@mui/material';
import logo from "./wits_logo.png"
import { useState } from 'react';
import Axios from 'axios';
import { CreateLogin } from '../../../index.js';
import { resolvePath, useNavigate } from 'react-router-dom';

import * as Msal from "msal";
import {msalConfig,  loginRequest} from "../authConfig";


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  height:600,
  bgcolor: 'background.paper',
  borderRadius: '7px',
  boxShadow: 24,
  p: 4,
  textAlign: "center",
  alignItems: "center"
  
};

  const myMSALObj = new Msal.UserAgentApplication(msalConfig);




export default function ModalLogin(props){

  let isTrue = false ;

  const [lgEmail, setlgEmail] = useState("");
  const [lgPassword, setlgPassword] = useState("");


  console.log(sessionStorage.getItem("auth"));

  const signOut = async() => {
    myMSALObj.logout();
  }

  const  signIn = () =>{

    myMSALObj.loginPopup(loginRequest)
      .then( async loginResponse => {
        console.log("id_token acquired at: " + new Date().toString());
        console.log(loginResponse);
        
        if (myMSALObj.getAccount()) {
          var lgcUser_id ="";
          var lgRole ="";
          sessionStorage.setItem("auth", true);
          sessionStorage.setItem("microOBJ", true);

          setlgEmail(myMSALObj.getAccount().userName);
          const response = await Axios.post("http://localhost:3001/FetchRole",{setlgEmail: myMSALObj.getAccount().userName });
          if( response != null){

            lgcUser_id = response.data[0]["user_id"];
            lgRole =response.data[0]["role"];
            sessionStorage.setItem("user_id",lgcUser_id );
            sessionStorage.setItem("user_role",lgRole );
            sessionStorage.setItem("logged_id",true);
        
            isTrue = true ;
            handleClose()
          }

        }
        // else{
        //   signIn();
        // }

      }).catch(error => {
        console.log(error);
      });
  }


  const  loginCheck = async ()=>{
    console.log("called");  
    var lgcUser_id ="";
    var lgRole ="";
    console.log(lgEmail);
    console.log(lgPassword);
    const response = await Axios.post("http://localhost:3001/Login",{setlgEmail: lgEmail, setlgPassword: lgPassword });
    console.log(response.data);
    if(response.data != "incorrect"){
      console.log("if true");
      lgcUser_id = response.data[0]["user_id"];
      lgRole =response.data[0]["role"];
      sessionStorage.setItem("user_id",lgcUser_id );
      sessionStorage.setItem("user_role",lgRole );
      sessionStorage.setItem("logged_id",true);
      sessionStorage.setItem("auth", true);

      isTrue = true ;
    }else{
      console.log("if false");
      alert("The email or password is incorrect");
      console.log("incorrect");
      isTrue = false ;
    }
    console.log("end")
  }

  let navigate = useNavigate();
  const [open, setOpen] = React.useState(true);
  const handleOpen = () => { 
    // signIn(); 
    setOpen(true); 
    // navigate("/Login");
  }
  const handleClose = () => {
    setOpen(false); navigate("/"); }
  const login = async () => {if(lgPassword == ""){
    alert('Please type username and password');}
    else{ 
      await loginCheck(); 
      console.log(isTrue);
      if(isTrue){handleClose();}}
  }
   
    return(
    <div>
   
    <Modal id ="modal"
    open ={open}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    >
    <Box sx={style}>
    <Stack direction="column" spacing={2} sx={{ justifyContent: "center", alignItems: "center", marginTop: "15%"}}>
      <img style={{width: "80px", height: "80px"}} src ={logo}></img> 
      <h1>Login</h1>
      <TextField
      label = "email"
      // value = {lgEmail}
      id="outlined-required"
      sx ={{padding: "10px", width: "60%"}}
      onChange={(e) => {
        setlgEmail(e.target.value); }}
    />
    <TextField
      required
      id="outlined-required"
      label="Password"
      sx ={{padding: "10px", width: "60%"}}
      onChange={(e) => {setlgPassword(e.target.value); }}
    />
      <Button variant ="contained" onClick={login}>Log In</Button>
      
      <Button variant ="contained" onClick={signIn}>Log In With Microsoft</Button>

    </Stack>
    
    </Box>
  </Modal>
  </div>
    );
}