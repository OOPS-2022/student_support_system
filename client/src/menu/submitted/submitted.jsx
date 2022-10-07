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
import Axios from 'axios';
import Multiline from '../multiline';
import { shouldForwardProp } from '@mui/styled-engine';
import { useNavigate } from 'react-router-dom';
import { MenuItem } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import FaceIcon from '@mui/icons-material/Face';
import Popover from '@mui/material/Popover';



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
    backgroundColor: "rgba(6, 71, 150, 0.2) !important"
  },
}));






export default function Submitted() {

  let navigate = useNavigate();


  const colNamesSubmitted = ["Offender", "Offence", "Course Code", "Status"];
  let colNames = [];
  let rows = [];
  const [submitted_offences, setSubmitted] = React.useState([]);


 
  colNames = colNamesSubmitted;
  React.useEffect(() => {
    const getOff = async () => {
      if(sessionStorage.getItem("user_role")=="support"){
        const response = await Axios.post('http://localhost:3001/SubmittedOffences', {user_id : sessionStorage.getItem("user_id")});
        setSubmitted(response.data);
      }
      else if (sessionStorage.getItem("user_role")=="admin"){
        const response = await Axios.post('http://localhost:3001/AllSubmittedOffences');
        setSubmitted(response.data);
      }
      
    }
  
  getOff();
}, []);


  const [filter, setFilter] = React.useState("offender_name");
  const handleFilter = (event) => {
    setFilter(event.target.value);
  };

  const [copyList, setCopyList] = React.useState(submitted_offences);
  const requestSearch = (searched) => {

    setCopyList(Object.values(submitted_offences).filter((item) =>
      item[filter].toLowerCase().includes(searched.toLowerCase())))
      ;
  }
 

  return (

    <>
<div>
      
      <TableContainer component={Paper} className="pageWrapper" id="cT">

      <div style={{ display: "inline-flex", padding :"15px" }}>
      
        <TextField
          style={{ minWidth: "49%" ,paddingLeft: "15px"}}
          variant='outlined'
          placeholder='Search...'
          type='search'
          onInput={(e) => requestSearch(e.target.value)}
        />
      
        <TextField style={{ minWidth: "22%", paddingLeft: "15px" }}
          id="outlined-name"
          select
          default= {"offender_name"}
          value={filter}
          onChange={handleFilter}
          label="Filter by"
        >
          <MenuItem value={"offender_name"}>
            Offender
          </MenuItem>




        </TextField>
        


      </div>
        <Table sx={{ minWidth: 700 }} aria-label="customized table"  >
          <TableHead>
            <TableRow >
              {colNames.map((headerItem, index) => (
                <StyledTableCell key={index}>{headerItem}</StyledTableCell>
              ))}
            </TableRow>

          </TableHead>
          <TableBody>
            {Object.values(copyList.length > 0 ? copyList : submitted_offences).map((obj, index) => (
              <StyledTableRow key={index} onClick={() => { sessionStorage.setItem("ticket_id", obj["ticket_id"]); navigate("/Ticket"); }} hover={true}>
                <StyledTableCell >{obj["offender_name"]}</StyledTableCell>
                <StyledTableCell >{obj["offence_name"]}</StyledTableCell>
                <StyledTableCell >{obj["crs_code"]}</StyledTableCell>
                <StyledTableCell >{obj["offence_status"]}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>


  </>
  );
}
