import React, { useState, useEffect } from "react";
import "../page.css"
import { MenuItem, TextField, Button } from "@mui/material";
import Axios from 'axios';
import 'regenerator-runtime/runtime';

export async function getData (){
  return await Axios.get('http://localhost:3001/viewPledges');
  
}
export const createTest = async (testName, pledgeID, courseCode, testDate) => {
  return await Axios.post("http://localhost:3001/createTest", {
    testName: testName,
    pledgeID: pledgeID,
    courseCode: courseCode,
    testDate: testDate,
    creatorID: 4 //change later using local storage or whatever
  });
}

export default function CreateTest() {
  const [pledges, setPledges] = useState([]);
  const [testName, setTestName] = useState("");
  const [pledgeID, setPledgeID] = useState("3");
  const [courseCode, setCourseCode] = useState("");
  const [testDate, setTestDate] = useState("");


  useEffect( () => {
    
     getData().then(res => setPledges(res.data));
      
  }, [])



  return (
    <div className='pageWrapper'>
      <div>
        <label>Test name:</label>
        <input role="input1" type='text' onChange={(e) => { setTestName(e.target.value) }} />
        <br></br>
        <label>Course code:</label>
        <input type='text' onChange={(e) => { setCourseCode(e.target.value) }} />
        <br></br>
        <label>Test Date:</label>
        <input type='text' onChange={(e) => { setTestDate(e.target.value) }} />
        <br></br>
        <label>Please choose pledge:  </label>
        <select select style={{ marginTop: "10px", fontSize: 15 }} id="pledge_name" onChange={(e) => {
          setPledgeID(e.target.value);
        }} >
          {pledges.map((val) => {
            return <option value={val.pledge_id}>{val.pledge_name} ({val.pledge_type})</option>
          })}
        </select>
        <button role="buttonCreateTest" onClick={() => { createTest(testName, pledgeID, courseCode, testDate); }}>Submit:</button>
      </div>
    </div>
  );
}

