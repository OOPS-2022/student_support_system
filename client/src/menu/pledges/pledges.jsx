import React from "react";
import "../page.css";
import { MenuItem, TextField, Button, Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, TableContainer, Table, TableHead, TableRow, tableCellClasses, TableCell, TableBody, Modal, Stack, Tabs, Tab } from "@mui/material";
import Axios from 'axios';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import styled from "@emotion/styled";
import "./pledges.css"
import defaultPDF from "./default.pdf";
import clickedPDF from "./clickedPledge.pdf";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import CreateClickedPledge from "./clicked";


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

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
export default function Pledge() {
  let colNames = ["Pledge", "Description", "Type"];
  const [pledges, setPledges] = React.useState([]);
  const [fileURL, setFileURL] = React.useState(defaultPDF);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const [name, setName] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [fileUpload, setFileUpload] = React.useState();
  const [fileLabel, setLabel] = React.useState();
  const [message, setMessage] = React.useState("");
  const [clickedName, setClickName] = React.useState("");

  const rawHTML = `
    <div>
      <label>
      <input type="checkbox" id="myCheck">
      `+ message + `</label>
      <div>
      </div>
    </div>
    `;

  const uploadClicked = async (event) => {
    const response = await Axios.post("http://localhost:3001/createClickedPledge", {
      name: clickedName,
      desc: message
    })
    handleClose();
  }

  const tab2 =
    <div className='App'>
      <h1>Create Clicked Pledge</h1>
      <TextField
        id="outlined-required"
        label="What do you want your clicked pledge to say?"
        sx={{ padding: "5px", width: "90%" }}
        onChange={(e) => {
          setMessage(e.target.value);
        }}/>
      <TextField
        id="outlined-required"
        label="Name of clicked pledge."
        sx={{ padding: "5px", width: "90%" }}
        onChange={(e) => {
          setClickName(e.target.value);
        }}/>
      <h2> Preview of your clicked pledge:</h2>
      <div dangerouslySetInnerHTML={{ __html: rawHTML }}></div>
      <Button onClick={uploadClicked}>Upload</Button>
    </div>



  const getPledges = async () => {
    const response = await Axios.get("http://localhost:3001/viewPledges");
    setPledges(response.data);

  }

  getPledges();


  const getPDF = async () => {
    const response = await Axios.get('http://localhost:3001/viewFile', {
      responseType: 'blob', //Force to receive data in a Blob Format
      params: { 'id': sessionStorage.getItem("pledge_Id") }
    });
    //Create a Blob from the PDF Stream
    console.log(response);
    const file = new Blob(
      [response.data],
      { type: 'application/pdf' });
    if (sessionStorage.getItem("pledge_type") == "Clicked Pledge") {
      setFileURL(clickedPDF);
    } else {
      setFileURL(URL.createObjectURL(file));
      console.log(file);
    }
    //Build a URL from the file
    //Open the URL on new Window
  }

  const signedClick = (e) => { //handle change for uploading file
    setFileUpload(e.target.files[0]);
    setLabel(e.target.files[0].name);
    // console.log(e.target.files[0]);
    // sessionStorage.setItem("pdf", e.target.files[0].url) ;
  };
  const upload = (event) => {
    if (fileUpload != "") {
      let formData = new FormData();
      formData.append("file", fileUpload);
      formData.append("name", name);
      formData.append("desc", desc);
      console.log(formData);
      fetch("http://localhost:3001/createSignedPledge", {
        method: "post",
        body: formData
      })
      handleClose();
    }
  };

  const tab1 =
    <div>
      <h1> Add Pledge</h1>
      <TextField
        id="outlined-required"
        label="Name of pledge"
        sx={{ padding: "5px", width: "90%" }}
        onChange={(e) => {
          setName(e.target.value);

        }
        }
      />
      <TextField
        id="outlined-required"
        label="Description"
        sx={{ padding: "5px", width: "90%" }}
        onChange={(e) => {
          setDesc(e.target.value);
        }}

      />
      <Button
        variant="text"
        component="label"
      >
        Upload Pledge
        <input
          type="file"
          name="file"
          hidden
          onChange={signedClick}
        />
      </Button>

      <Button sx={{ marginBottom: "10px" }} variant="text">{fileLabel}</Button>


      <Button sx={{ marginTop: "10px", marginBottom: "20px" }} variant="contained" onClick={upload}>Add</Button>


    </div>
  const viewPDF = async () => {
    await getPDF();
  }

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };



  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  return (

    <div className="pageWrapper">

      <div className="flex-container">
        <div className="flex-child">
          <TableContainer component={Paper} className="pageWrapper" id="cT">
            <Table sx={{ minWidth: 500 }} aria-label="customized table"  >
              <TableHead>
                <TableRow >
                  {colNames.map((headerItem, index) => (
                    <StyledTableCell key={index}>{headerItem}</StyledTableCell>
                  ))}
                </TableRow>

              </TableHead>
              <TableBody>
                {Object.values(pledges).map((obj, index) => (
                  <StyledTableRow key={index} onClick={async () => { sessionStorage.setItem("pledge_Id", (obj["pledge_id"])); sessionStorage.setItem("pledge_type", obj["pledge_type"]); viewPDF(); }}>
                    <StyledTableCell >{obj["pledge_name"]}</StyledTableCell>
                    <StyledTableCell >{obj["pledge_desc"]}</StyledTableCell>
                    <StyledTableCell>{obj["pledge_type"]}</StyledTableCell>
                  </StyledTableRow>
                ))}
                <Button variant="outlined" onClick={handleOpen} sx={{ marginLeft: "10px", marginRight: "150px", marginTop: "20px" }}>add</Button>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className="flex-child">
          <Card sx={{ width: "100%" }}>
            <CardActionArea >
              <Document file={fileURL}>
                <Page height={750} pageNumber={1} />
              </Document>
            </CardActionArea>

          </Card>
        </div>
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
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Signed Pledge"></Tab>
                    <Tab label="Clicked Pledge"></Tab>
                  </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                  {tab1}
                </TabPanel>
                <TabPanel value={value} index={1}>
                  {tab2}
                </TabPanel>
              </Box>
              <Button sx={{ marginTop: "10px" }} onClick={handleClose}>Cancel</Button>
            </Stack>
          </Box>
        </Modal>

      </div>

    </div>





  );

}
