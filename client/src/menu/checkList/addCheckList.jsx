import React, { useEffect, useState} from "react";
//import * as React from 'react';
import "../page.css"
import { MenuItem, TextField, Button, Box, Typography, Tabs, Tab } from "@mui/material";
import Axios from 'axios';
import PropTypes from 'prop-types';
import "./oi.css";
import "../page.css"
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import "../page.css"
import Modal from '@mui/material/Modal';
import { Stack } from '@mui/material';
import Multiline from '../multiline';
import { shouldForwardProp } from '@mui/styled-engine';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "rgba(6, 71, 150, 0.6)",
      
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: "rgb(231,206,140,0.4)",
   
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    }, 
    "&:hover": {
      backgroundColor:  "rgba(6, 71, 150, 0.2) !important"
    } ,
  }));
  
  const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 500,
      height:550,
      bgcolor: 'background.paper',
      borderRadius: '7px',
      boxShadow: 24,
      p: 4,
      textAlign: "center",
      alignItems: "center"
      
    };



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


export default function checkList() {
  const events=[];
  
  const [aQuestion, setaQuestion] = React.useState(null);

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
 
  const [checkids, setCheckids] = React.useState("");
  const handleCheckids = (e) => {
      setCheckids(e.target.value["pledge_name"]);;
  };

  const [checki, setChecki]=React.useState([]);
  const viewCheck_id = async () => {
    Axios.post('http://localhost:3001/viewCheck_id' , {session_id : sessionStorage.getItem("session_id")}).then((response) => {
      setChecki(response.data)
  })
  }
  viewCheck_id();
    

  //Table

  const [open, setOpen] = React.useState(false);

  const [check_id, setCheckid]= React.useState("");
  const [questionNum, setQuestionNum]=React.useState("");
  const [details, setDetails] = React.useState("");
  const [session_id, setid] = React.useState("");
  const [hide, setHide] = React.useState(false);

  const[label, setLabel] = React.useState("");
  // console.log(sessionStorage.getItem("session_id"))
  // setid(sessionStorage.getItem("session_id"));

  const colNamesPossible = ["Question Number", "Question details"];
  let colNames = [];
  let rows = [];

  const [check_list, setCheckList]= React.useState([]);
  //let page = props.page;



  const deleteOffence = async () => {
    const response = await Axios.post("http://localhost:3001/deleteCheckListQuestion",{session_id: sessionStorage.getItem("session_id"), checklist_id: check_id, question_num : questionNum});
  }

  const edit = async () => {
    const response = await Axios.post("http://localhost:3001/updateCheckListQuestion",{session_id: sessionStorage.getItem("session_id"), checklist_id: check_id, question_num : questionNum , question_details : details });
    // check();
  }

  
  const addQuestion = async () => {
    const response = await Axios.post("http://localhost:3001/addCheckListQuestion",{session_id: sessionStorage.getItem("session_id"), checklist_id: check_id, question_details: aQuestion });
    
  }

  const addCheckList = async () => {
    const response = await Axios.get('http://localhost:3001/addCheckList') ;
    setCheckid(response.data.check_id+1);
  }

  const check = async ()=>{
    const response = await Axios.post('http://localhost:3001/allCheckListQuestions', {session_id: sessionStorage.getItem('session_id'), checklist_id: check_id}) ;//{session_id: sessionStorage.getItem("session_id"), checklist_id: check_id}) ;
    setCheckList(response.data);
  }


  colNames = colNamesPossible;
  
  // check()
  rows = check_list;
  const handleOpen = () => {
    setLabel("Edit");
    setOpen(true);
    setHide(true);}
  
  const handleClose = () => setOpen(false);
  const editHandle = () => {edit(); handleClose();}
  const deleteHandle = () => {deleteOffence(); handleClose();}
  

  return (
    <div className="pageWrapper">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Add"></Tab>
          <Tab label="Edit"></Tab>

       

        </Tabs>
      </Box>

      <TabPanel value={value} index={1}>

      <div>
      <h4>Select checklist</h4>
           <TextField style={{ minWidth: "90%" }}
            id="outlined-name"
            label="Check list"
            select
            value={checkids["check_id"]}
        >
            {checki.map((checkids) => (
                <MenuItem key ={checkids} value={checkids} onClick={(e) => {setCheckid(e.target.innerText) ; check()}}>
                    {checkids["check_id"]}
                </MenuItem>
            ))}
        </TextField>
        <h2></h2>

    <TableContainer component={Paper} className ="pageWrapper" id="cT">
      <Table sx={{ minWidth: 700 }} aria-label="customized table"  >
        <TableHead>
          <TableRow >
          {colNames.map((headerItem, index) =>  (
            <StyledTableCell key= {index}>{headerItem}</StyledTableCell>
            ))}
          </TableRow>
        
        </TableHead>
        <TableBody>
        {Object.values(rows).map((obj,index) => (
            <StyledTableRow  key = {index} onClick={() =>{handleOpen(); setQuestionNum(obj["question_number"]); setDetails(obj["question_details"]);}}  hover={true}>
                {/* <StyledTableCell >{obj["check_id"]}</StyledTableCell> */}
                <StyledTableCell >{obj["question_number"]}</StyledTableCell>
                <StyledTableCell >{obj["question_details"]}</StyledTableCell>
                {/* <StyledTableCell >{obj["session_id"]}</StyledTableCell> */}
            </StyledTableRow>
          ))}
        
        </TableBody>
      </Table>
    </TableContainer>
    </div>
    <div>
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
      <Stack direction="column" spacing={2} sx={{ justifyContent: "center", alignItems: "center"}}>
        <h1>{label}:</h1>
        {/* <TextField
        id="outlined-required"
        label="check_id"
        defaultValue= {check_id}
        sx ={{padding: "5px", width: "90%"}}
        onChange={(e) => {
         setCheckid(e.target.value);
         
        }
        }
      /> */}
      {/* <TextField
        id="outlined-required"
        label="question_number"
        defaultValue= {questionNum}
        sx ={{padding: "5px", width: "90%"}}
        onChange={(e) => {
          setQuestionNum(e.target.value);
          }}

        
      /> */}
      <TextField
        label ="question_details"
        multiline
        value = {details}
        sx ={{padding: "1px" , width: "90%"}}
        onChange={(e) => {
          setDetails(e.target.value);
          }}
      />
       {/* <TextField
        label ="session_id"
        multiline
        value = {session_id}
        sx ={{padding: "1px" , width: "40%"}}
        onChange={(e) => {
          setid(e.target.value);
          }}
      /> */}


      <div>
      {hide && (<Button variant ="contained" sx={{marginRight : "10px"}} onClick={ edit} >Update</Button>)}
      {hide && ( <Button variant ="contained"  onClick={deleteOffence}  >Delete</Button>)}

      </div>
      </Stack>
      <Button style={{bottom: "-5%"}} onClick={handleClose}>Cancel</Button>
      </Box>
    </Modal>
    
  </div>
       </TabPanel>


      <TabPanel value={value} index={0}>
    
        {
          <div className="oiForm">
            <h1>Creating checklist</h1>
            <h3>Create new checklist</h3>
            <Button variant="contained" onClick={addCheckList}>Add Checklist</Button>
            <TextField label="Add question:"
              style={{ minWidth: "300px" }}
              onChange={(e) => {
                setaQuestion(e.target.value);
              }}
            />
            <Button variant="contained" onClick={addQuestion}>Add Question</Button>
            

            
          </div>}

      </TabPanel>

      
     

    </div>
  );
}