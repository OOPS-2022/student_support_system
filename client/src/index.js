
import ReactDOM from 'react-dom';
import App from './App';
import './App.css';
import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { BrowserRouter as Router , Route, Routes } from "react-router-dom";

ReactDOM.render(  // bellow will contain the paths to each page 
    <Router>
      <Routes>
        <Route path = "/createlog" element ={<CreateLog />}/> 
        <Route path = "/" element ={<Menu />}/> 
        <Route path = "/academicOffenceMenu" element ={<AcademicOffenceMenu />}/>
        <Route path = "/viewOffences" element ={<ViewOffences />}/>
      </Routes>
    </Router>,
 
  document.getElementById('root')
);


function CreateLog(){     // this is the create log page

  const [offenderName, setOffenderName] = useState("");
  const [offenceType, setOffenceType] = useState("-1");
  const [offenceDetails, setOffenceDetails] = useState("");
  const [offenceCode, setOffenceCode] = useState("");
  const [offenceLink, setOffenceLink] = useState("");
  const [offenceOther, setOffenceOther] = useState("");

  const [offenceNameList, setOffenceNameList] = useState([]); 

  function populateOffenceNameList(){
    Axios.get("http://localhost:3001/getOffenceNameList").then((response) => {
      setOffenceNameList(response.data);
    });
  }

  function proccessData( ){ 
  
    if (offenderName === "" || offenceType === "-1"  || offenceDetails === "" || offenceCode === "" || offenceLink === ""){
        return false;
    }
    
    if (offenceType === "other" && offenceOther === "" ){
        return false;
    }
    return true;
  }

  const submitLog = () =>{
    if (!proccessData()){
      alert("Please fill in all necessary details");
    }else{
      Axios.post("http://localhost:3001/createlog", {
        offenderName: offenderName, 
        offenceType:offenceType,
        offenceDetails:offenceDetails,
        offenceCode:offenceCode,
        offenceLink:offenceLink,
        offenceOther:offenceOther,
      }).then((res) => {
        alert(res.data);
      });
  }
  }

  return (
    <div className="App">
      <h1> CRUD App</h1>

      <div>
      <label>Offender name:</label>
        <input type = "text" name="offenderName" onChange={(e) => {
          setOffenderName(e.target.value);
        }} />

        <p><b>Offence* :</b>
        
        <select id="offence_type" onChange={(e) => {
          setOffenceType(e.target.value); }} >
            <option value='-1'>Please choose an option</option>
            <option value='Plagiarism'>Plagiarism</option>
            <option value='Copying'>Copying</option>
            <option value='Impersonation'>Impersonation</option>
            <option value='Unauthorized Collaboration'>Unauthorized Collaboration</option>
            <option value='other'>Other</option>
            
        </select>
    </p>

    <form>
        Other : (please specify)
        <input type="text" name="offence_type_other" onChange={(e) => {
          setOffenceOther(e.target.value); }}/>
    </form>

    <form>
        Details of offence* :
        <input type="text" name="offence_details"  onChange={(e) => {
          setOffenceDetails(e.target.value); }}/>
    </form>

    <form>
        Course Code* :
        <input type="text" name="course_code"  onChange={(e) => {
          setOffenceCode(e.target.value); }}/>
    </form>

    <form>
        Evidence* :
        <input type="text" name="evidence"  onChange={(e) => {
          setOffenceLink(e.target.value); }}/>
    </form>
        <button onClick={() => {
            submitLog();
        }}>Create Log</button>
      </div>

    </div>

  );



}

function Menu(){ //this is the menu page - notice "/" in route, shows on startup
  return (
    <div className='App'>
      <h1>Menu</h1>
    </div>
    );
}

function AcademicOffenceMenu(){
  return (
    <div className='App'>
      <h1>Academic Offence Menu</h1>
    </div>
    );
}

function ViewOffences(){
  return (
    <div className='App'>
      <h1>View Offences</h1>
    </div>
    );
}


export default App;
