import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import "../page.css"
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { Stack, TextField } from '@mui/material';
import Axios  from 'axios';
import Multiline from '../multiline';
import { shouldForwardProp } from '@mui/styled-engine';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "rgb(79,147,210)",
    fontSize: 20,
    
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: "rgb(147,183,214,0.4)",
 
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



export default function ClickTable(props) {
  const [open, setOpen] = React.useState(false);

  const [offence, setOffence]= React.useState("");
  const [severity, setSeverity]=React.useState("");
  const [desc, setDesc] = React.useState("");
  const [offenceId, setOffenceId] = React.useState("");
  const [hide, setHide] = React.useState(false);

  const[label, setLabel] = React.useState("");


  const colNamesPossible = ["Offence","Severity", "Description"];
  let colNames = [];
  let rows = [];
  const [possible_offences, setPossible] = React.useState([]);
  let page = props.page;

  const deleteOffence = async () => {
    const reponse = await Axios.post("http://localhost:3001/delete",{
      offenceId: offenceId
    }
    
    )

  }

  const edit = async () => {
    const response = await Axios.post("http://localhost:3001/update",{
      offenceName: offence,
      severity: severity,
      desc: desc,
      offenceId: offenceId
    })
  }

  const add = async () => {
    const response = await Axios.post("http://localhost:3001/insert",{
      offenceName: offence,
      severity: severity,
      desc: desc,
    })
  }





  const possible = async ()=>{
   const response = await Axios.get('http://localhost:3001/PossibleOffences') ;
   setPossible(response.data);
  
  }

 



    colNames = colNamesPossible;
    possible();
    rows = possible_offences;
    

  


  

  const handleOpen = () => {
    setLabel("Edit");
    setOpen(true);
    setHide(true);}
  
  const handleClose = () => setOpen(false);
  const editHandle = () => {edit(); handleClose();}
  const deleteHandle = () => {deleteOffence(); handleClose();}
  const addHandle = () => { setLabel("Add");setOpen(true); setHide(false); setDesc(""); setOffence(""); setSeverity(""); setOffenceId("")}
  const addOffence = () => {add(); handleClose();}
  return (
   
    <>
    <div>
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
            <StyledTableRow  key = {index} onClick={() =>{handleOpen(); setOffenceId(obj["offence_id"]); setOffence(obj["offence_name"]); setSeverity(obj["severity"]); setDesc(obj["offence_desc"]) }}  hover={true}>
                <StyledTableCell >{obj["offence_name"]}</StyledTableCell>
                <StyledTableCell >{obj["severity"]}</StyledTableCell>
                <StyledTableCell >{obj["offence_desc"]}</StyledTableCell>
            </StyledTableRow>
          ))}
          <Button  variant ="outlined" onClick={addHandle}  sx ={{marginRight:"650px", marginTop :"20px"}}>add</Button>
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
        <TextField
        id="outlined-required"
        label="Offence"
        defaultValue= {offence}
        sx ={{padding: "5px", width: "90%"}}
        onChange={(e) => {
         setOffence(e.target.value);
         
        }
        }
      />
      <TextField
        id="outlined-required"
        label="Severity"
        defaultValue= {severity}
        sx ={{padding: "5px", width: "90%"}}
        onChange={(e) => {
          setSeverity(e.target.value);
          }}

        
      />
      <TextField
        label ="Description"
        multiline
        value = {desc}
        sx ={{padding: "5px" , width: "90%"}}
        onChange={(e) => {
          setDesc(e.target.value);
          }}

        
      />
      <div>
      {hide && (<Button variant ="contained" sx={{marginRight : "10px"}} onClick={ editHandle} >Update</Button>)}
      {hide && ( <Button variant ="contained"  onClick={deleteHandle}  >Delete</Button>)}
      {!hide && ( <Button variant ="contained"  onClick={addOffence}  >Add</Button>)}
      </div>
      </Stack>
      <Button style={{bottom: "-5%"}} onClick={handleClose}>Cancel</Button>
      </Box>
    </Modal>
    
  </div>
  </>
  );
}
