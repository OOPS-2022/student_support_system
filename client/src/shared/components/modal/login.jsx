import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import "./login.css"
import { Stack, TextField } from '@mui/material';
import logo from "./wits_logo.png"
import ModalLogin from './modalLogin';
import { useNavigate } from 'react-router-dom';


 function Login() {
  let navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {setOpen(true); navigate("/Login");}
  const handleClose = () => {setOpen(false); navigate("/");}

  return (
    
    <div >
      <Button onClick={handleOpen} sx={{marginTop: "35%"}}>Log in</Button>
      <ModalLogin open={open} close ={handleClose}/>
    </div>
  
  );
}

export default Login;