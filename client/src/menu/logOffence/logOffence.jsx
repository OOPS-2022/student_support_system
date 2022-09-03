import React from "react";
import "../page.css"
import "./logOffence.css";
import { MenuItem, TextField, Button } from "@mui/material";
import Axios from 'axios';
import { convertLength } from "@mui/material/styles/cssUtils";




function LogOffence() {

  const [offenderName, setOffenderName] = React.useState("");
  const [offenceType, setOffenceType] = React.useState("-1");
  const [offenceDetails, setOffenceDetails] = React.useState("Controlled");
  const [offenceCode, setOffenceCode] = React.useState("");
  const [offenceOther, setOffenceOther] = React.useState("");
  const [file, setFile] = React.useState("");
  const [fileLabel, setLabel] = React.useState("");


  const [option, setOption] = React.useState("");
  const handleOption = (e) => {
    setOption(e.target.value);;
    setOffenceType(possible_offences[e.target.value - 1].offence_name);
    console.log(possible_offences[e.target.value - 1].offence_name);
  };

  const handleChange = (e) => { //handle change for uploading file
    setFile(e.target.files[0]);
    setLabel(e.target.files[0].name);

    // console.log(e.target.files[0]);
    // localStorage.setItem("pdf", e.target.files[0].url) ;
  };

  const viewPDF = (e) => {
    //Build a URL from the file
    const fileURL = URL.createObjectURL(file);
    console.log(fileURL);
    //Open the URL on new Window
    window.open(fileURL);
  }



  const proccessData = () => {
    console.log("name = " + offenderName);
    console.log("desc=" + offenceDetails);

    if (offenderName === "" || offenceDetails === "") {
      return false;
    }

    if (offenceType == "-1") {
      if (offenceOther === "") {
        return false;
      } else {
        offenceType = "other";
        return true;
      }
    }
    return true;
  }



  const submitLog = () => {
    let result = proccessData();
    if (result == false) {
      alert("Please fill in all necessary details");
    } else if (!file == "") {
      let formData = new FormData();
      formData.append('file', file);
      formData.append('offenderName', offenderName)
      formData.append('offenceType', offenceType);
      formData.append('offenceDetails', offenceDetails);
      formData.append('offenceCode', offenceCode);
      formData.append('offenceOther', offenceOther);
      formData.append('submittedBy', localStorage.getItem("user_id"));
      formData.append('offenceStatus', "Pending");
      fetch('http://localhost:3001/LogOffence', {
        method: "post",
        body: formData
      })

    } else {
      const result = Axios.post('http://localhost:3001/LogOffenceNoFile', {
        offenderName: offenderName,
        offenceType: offenceType,
        offenceDetails: offenceDetails,
        offenceCode: offenceCode,
        offenceOther: offenceOther,
        submittedBy: sessionStorage.getItem("user_id"),
        offenceStatus: "Pending"
      })

    }
  }
  const [possible_offences, setPossibleOffences] = React.useState([]) //to display list of offences for admin to see while editing
  const possible = async () => {
    const response = await Axios.get('http://localhost:3001/offences')
    setPossibleOffences(response.data)

  }

  possible();



  return (
    <>
      <div className="pageWrapper">
        <h1>Log Offence</h1>
        <div className="offenceForm">
          <TextField style={{ minWidth: "70%" }}
            label="Name of Offender"
            onChange={(e) => {
              setOffenderName(e.target.value);

            }} />
          <TextField style={{ minWidth: "70%" }}
            id="outlined-name"
            label="Offence"
            select
            defaultValue={possible_offences[0]}
            value={option}
            onChange={handleOption}
          >
            {possible_offences.map((option) => (

              <MenuItem key={option["offence_id"]} value={option["offence_id"]}>
                {option["offence_name"]}
              </MenuItem>


            ))}
            <MenuItem value="5">other</MenuItem>
          </TextField>
          <TextField label="Other(Please specify)"
            style={{ minWidth: "70%" }}
            onChange={(e) => {
              setOffenceOther(e.target.value);

            }} />
          <TextField label="Details of Offence"
            style={{ minWidth: "70%" }}
            multiline
            maxRows={4}
            onChange={(e) => {
              setOffenceDetails(e.target.value);

            }} />
          <TextField label="Course Code"
            style={{ minWidth: "70%" }}
            onChange={(e) => {
              setOffenceCode(e.target.value);

            }} />

          <div style = {{display : "inline-flex"}}>
          <Button
            variant="outlined"
            component="label"
          >
            Upload Evidence
            <input
              type="file"
              name="file"
              hidden
              onChange={handleChange}
            />
          </Button>
          <Button variant="text" onClick={viewPDF}>{fileLabel}</Button>
          </div>
          <Button variant="contained" onClick={submitLog} >Submit</Button>
        </div>
      </div>

    </>


  );
}

export default LogOffence;