import React, { useEffect, useState } from "react";
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
import { CopyAllOutlined } from "@mui/icons-material";


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
    backgroundColor: "rgba(6, 71, 150, 0.2) !important"
  },
}));

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  height: 550,
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
  const events = [];

  const [aQuestion, setaQuestion] = React.useState(null);

  const [value, setValue] = React.useState(0);


  const [checkids, setCheckids] = React.useState("");
  const handleCheckids = (e) => {
    setCheckids(e.target.value["pledge_name"]);;
  };

  const [checki, setChecki] = React.useState([]);
  const viewCheck_id = async () => {
    Axios.post('http://localhost:3001/viewCheck_id', { session_id: sessionStorage.getItem("session_id") }).then((response) => {
      setChecki(response.data)
    })
  }



  useEffect(() => {
    viewCheck_id();
  })

  const copyToClipboard = () => {
    const embedUrl = "http://localhost:3000/EmbeddedSession"+ sessionStorage.getItem("session_id");
    navigator.clipboard.writeText(embedUrl);
  }


  //Table

  const [open, setOpen] = React.useState(false);


  const [check_id, setCheckid] = React.useState("");
  const [questionNum, setQuestionNum] = React.useState("");
  const [details, setDetails] = React.useState("");
  const [session_id, setid] = React.useState("");
  const [hide, setHide] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [isQuestion, setIsQuestion] = React.useState(false);
  const [questions, setQuestions] = React.useState([]);


  const handleChangeID = (event) => {
    setCheckid(event.target.value);
  };
  const [label, setLabel] = React.useState("");
  // console.log(sessionStorage.getItem("session_id"))
  // setid(sessionStorage.getItem("session_id"));

  const colNamesPossible = ["Question Number", "Question details"];
  let colNames = [];
  let rows = [];

  const [check_list, setCheckList] = React.useState([]);
  //let page = props.page;



  const deleteOffence = async () => {
    const response = await Axios.post("http://localhost:3001/deleteCheckListQuestion", { session_id: sessionStorage.getItem("session_id"), checklist_id: check_id, question_num: questionNum });
  }

  const edit = async () => {
    const response = await Axios.post("http://localhost:3001/updateCheckListQuestion", { session_id: sessionStorage.getItem("session_id"), checklist_id: check_id, question_num: questionNum, question_details: details });
    // check();
  }


  const addQuestion = async () => {
    setQuestions(OldArray => [...OldArray, aQuestion]);
    const response = await Axios.post("http://localhost:3001/addCheckListQuestion", { session_id: sessionStorage.getItem("session_id"), checklist_id: check_id, question_details: aQuestion });

  }

  const addCheckList = async () => {
    const response = await Axios.get('http://localhost:3001/addCheckList');
    setCheckid(response.data.check_id + 1);
  }

  const setCheck = async (checkID) => {
    const response = await Axios.post('http://localhost:3001/allCheckListQuestions', { session_id: sessionStorage.getItem('session_id'), checklist_id: checkID });
    setCheckList(response.data);
  }

  useEffect(() => {
    const setCheck = async (checkID) => {
      const response = await Axios.post('http://localhost:3001/allCheckListQuestions', { session_id: sessionStorage.getItem('session_id'), checklist_id: checkID });
      setCheckList(response.data);
    }

    setCheck();
  }, []);

  colNames = colNamesPossible;

  // check()
  rows = check_list;
  const handleOpen = () => {
    setLabel("Edit");
    setOpen(true);
    setHide(true);
  }

  const [submitted, setSubmitted] = React.useState(false);
  const [sessionID, setSessionID] = React.useState(0);
  const handleClose = () => setOpen(false);
  const handleQuestion = () => { addQuestion(); viewCheck_id(); setCheck(); setSubmitted(true); }

  const editHandle = () => { edit(); handleClose(); }
  const deleteHandle = () => { deleteOffence(); handleClose(); }


  return (
    <div className="pageWrapper">
      <div style={{ display: "inline-flex", justifyContent: "left" }} >
        <div style={{ paddingTop: "1%" }}>

          <h3>Select Checklist</h3>
        </div>
        <div>


          <TextField style={{ minWidth: "30vw", padding: "15px" }}
            id="outlined-name"
            label=" Check list"
            select
            value={checkids["check_id"]}
          >
            {checki.map((checkids) => (
              <MenuItem key={checkids["check_id"]} value={checkids["check_id"]} id={checkids["check_id"]} onClick={(e) => { setCheck(e.target.innerText); setSessionID(e.target.innerText) }}>
                {checkids["check_id"]}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div style={{ paddingTop: "2%" }}>

          <Button variant="contained" onClick={(e) => {copyToClipboard(); }}>Embed Checklist</Button>
        </div>

        <div style={{ paddingLeft: "20%", paddingTop: "2%" }}>

          <Button variant="contained" onClick={(e) => { addCheckList(); setOpen(true); setIsQuestion(true); setIsEdit(false); }}>Create Checklist</Button>




        </div>
      </div>
      <div>
        <TableContainer component={Paper} className="pageWrapper" id="cT">
          <Table sx={{ minWidth: 700 }} aria-label="customized table"  >
            <TableHead>
              <TableRow >
                {colNames.map((headerItem, index) => (
                  <StyledTableCell key={index}>{headerItem}</StyledTableCell>
                ))}
              </TableRow>

            </TableHead>
            <TableBody>
              {Object.values(check_list).map((obj, index) => (
                <StyledTableRow key={index} onClick={() => { handleOpen(); setQuestionNum(obj["question_number"]); setDetails(obj["question_details"]); setIsEdit(true); setIsQuestion(false); }} hover={true}>
                  <StyledTableCell >{obj["question_number"]}</StyledTableCell>
                  <StyledTableCell >{obj["question_details"]}</StyledTableCell>

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
          contentLabel="edit"
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div>
            <Box sx={style}>
              {isQuestion &&

                (<Stack direction="column" spacing={2} sx={{ justifyContent: "center", alignItems: "center", marginTop: "15%" }}>
                  <h1>Add Questions</h1>
                  <TextField label="Add question:"
                    style={{ minWidth: "300px" }}
                    onChange={(e) => {
                      setaQuestion(e.target.value);
                    }}
                  />

                  <Button variant="contained" onClick={handleQuestion}>Add Question</Button>
                  <Button variant="contained" onClick={handleClose}>Submit</Button>
                  {Object.values(questions).map((obj) => (<p1 style={{ fontFamily: "Arial, Helvetica, sans-serif" }} >{obj}</p1>))}
                </Stack>)}


              {isEdit && (
                <Stack direction="column" spacing={2} sx={{ justifyContent: "center", alignItems: "center", marginTop: "15%" }}>
                  <h1>{label}:</h1>
                  <TextField
                    label="question_details"
                    multiline
                    value={details}
                    sx={{ padding: "1px", width: "90%" }}
                    onChange={(e) => {
                      setDetails(e.target.value);
                    }}
                  />

                  <div>
                    {hide && (<Button variant="contained" sx={{ marginRight: "10px" }} onClick={edit} >Update</Button>)}
                    {hide && (<Button variant="contained" onClick={deleteOffence}  >Delete</Button>)}

                  </div>
                </Stack>)}
              <Button style={{ bottom: "-5%" }} onClick={handleClose}>Cancel</Button>

            </Box>
          </div>

        </Modal>

      </div>







    </div>
  );
}