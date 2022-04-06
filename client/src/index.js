import ReactDOM from 'react-dom';
import App from './App';
import './App.css';
import logo from './wits_logo.png';
import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { BrowserRouter as Router , Route, Routes } from "react-router-dom";
import styled from "styled-components";



ReactDOM.render(
  <Router>
    <Routes> 
      <Route path = "/login" element ={<CreateLogin />}/>
      <Route path = "/offencelist" element ={<EditOffences />}/>
      <Route path="/viewPossibleOffences" element={<ViewPossibleOffences />} /> 
    </Routes>
  </Router>,

  document.getElementById('root')
);

function CreateLogin(){
  const [lgEmail, setlgEmail] = useState("");
  const [lgPassword, setlgPassword] = useState("");
  const [lgUserList,setlgUserList] = useState([]);
  //const [lgcUser_ID,setlgcUser_ID] = useState("");
  //const [lgcPassword,setlgcPassword] = useState("");
  //const [lgRole,setlgRole] = useState("");
  var lgcUser_id ="";
  var lgRole ="";
  const navigate = useNavigate();

  function setlgUserInfo(email){
      Axios.post("http://localhost:3001/apiLogin/getInfo",{setlgEmail: email}).then((response)=>{
        setlgUserList(response.data);
        console.log(response.data);
      });

  }

  function checkPassEmail(){
    if(lgPassword == ""){
     alert('Please type username and password');
     return;
   }
  if(lgUserList.length>0){
    //-----------------------------------------get the user ID and role
    lgcUser_id = lgUserList[0]["user_id"];
    //setlgcPassword(lgUserList[0]["password"]);
    lgRole =lgUserList[0]["role"];
    if(lgPassword == lgUserList[0]["password"]){
      //---------------------------------------------change page
      navigate("/viewPossibleOffences");
    }
    else{
      alert("Incorrect password");
    }
  }else{
    alert('Incorrect email');
  }
    
 }

 const Button = styled.button`
    background-color: rgb(14,71,161);
    min-width: 10rem;
    height: 2rem;
    color: white;
    cursor: pointer;
    border-radius: 4px;
  `;

  function Header1(props){
    return <h1> {props.text}</h1>;
  }

  const buttonStyle = {
    width: "50px",
    margin : "25px",
  }

 return (
  <div>
    <br></br>
    <div style={{ display: "flex", marginLeft: "15%" }}>
      
                  <img src={logo} height={80} width={80} />
                  <div style={{ display: "flex", marginBottom: "8%" }}></div>   
                  <Header1 text="WITS SUPPORT CENTRE" /> 
                  
                  <Button style={buttonStyle}>HELP</Button> 
              </div>
    <div style={{ display: "flex", marginLeft: "15%" }}>
    <div style={{ display: "flex", marginBottom: "3%" }}></div>   
    <form>
      <label>
        Username:{" "}
        <input type="text" name="lgEmail"  onChange={(e) => {
        setlgUserInfo(e.target.value); }}/>
      </label>
    </form>
    </div>
    <div style={{ display: "flex", marginLeft: "15%" }}>
    <div style={{ display: "flex", marginBottom: "3%" }}></div>   
    <form>
      <label>
        Password:{" "}
        <input type="text" name="lgPassword"  onChange={(e) => {
        setlgPassword(e.target.value); }}/>
      </label>
    </form>
    </div>
    <div style={{ display: "flex", marginLeft: "14.8%" }}>
   
    <Button  onClick={checkPassEmail} >Log in</Button>

    </div>

  </div>
)

  
}


function EditOffences(){
  const colNames = ["Offence", "Severity"];
  const [offencename,setOffencename]= useState("");
  const [severity,setSeverity] = useState("");
  const list = [{Offence: "Copy", Severity: 1}, {Offence: "Cheat", Severity: 3}, 
  {Offence: "Plaig", Severity: 2}, {Offence: "test", Severity: 100}]


  const addoffence = () =>{
    Axios.post('https://localhost:3000/adjustlist/insert', {
      offencename: offencename, 
      severity: severity
    }).then(() =>
    alert("New offence added"));
  }

  const editoffence = () =>{
    Axios.post('https://localhost:3000/adjustlist/update',{
      offencename: offencename, 
      severity: severity
    }).then(() =>
    alert("offence updated"));
  }

  const deloffence = () =>{
    Axios.post('https://localhost:3000/adjustlist/delete',{
      offencename: offencename
    }).then(() =>
    alert("offence deleted"));
  }
   
  function delOF(){
    if (offencename == ""){
      alert("fill in offence name");
    }
    else{
      deloffence();
    }
  }

  function editOF(){
    if (offencename == "" && severity ==""){
      alert("fill in offence name and severity level");
    }
    else{
      editoffence();
    }
  }
  
  function addOF(){
    if (offencename == "" && severity ==""){
      alert("fill in offence name and severity level");
    }
    else{
      addoffence();
    }
  }

  function Header1(props){
    return <h1> {props.text}</h1>;
    
  }

  function Button(props) {
    const isDisabled = props?.disabled ?? false;
    return (
        <button className="custom-button" onClick = {props?.click} style={props?.style} disabled={isDisabled}>{props.buttonText}</button>
    )
  }

  const buttonStyle = {
    width: "50px",
    margin : "25px",

  
  }
  const buttonStyle2 = {
    minWidth: "10px",
    margin : "25px",
    backgroundColor :"white",
    color: "black",

  
  }

  function Table({list, colNames, width = "auto", height = "auto"}) {
    return (
      <div className="App">
            <table cellSpacing="20" style={{width: "350px", height: "250px", padding: "10px 885px"}}>
                  <thead>
                    <tr>
                      {colNames.map((headerItem, index) =>  (
                        <th key = {index}>
                          {headerItem.toUpperCase()} 
                        </th>
                      ))}
                    </tr>
                  </thead>  
  
                  <tbody>
                    {Object.values(list).map((obj, index) => (
                      <tr key={index}>
                        {Object.values(obj).map((value, index2) =>
                          <td key={index2}>
                              {value}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
  
            </table>   
      </div>
    );
  }

  return (
    <div className="App">
          
          <div id="head">
            <div style={{ display: "flex", marginLeft: "20%" }}>
              <img src={logo} height={80} width={80} />
              <Header1 text="OFFENCE LIST AND OFFENCE EDITING" />
              <Button buttonText="HELP" style={buttonStyle} />         
            </div>
          </div>

          <div id="table">
            <Table list={list} colNames={colNames} />
          </div>
          
          <div id="inText">
            <p>
              Offence editing and adding:
            </p>
            
            <form id = "input1">
              <text>Offence name:</text>
              <input type="text" name="inOffence"  onChange={(e) => {
                setOffencename(e.target.value); }}/> 
            </form>

            <form>
              <test>Severity level:</test>
              <input type="text" name="inSeverity"  onChange={(e) => {
                setSeverity(e.target.value); }}/> 
            </form>

            <form>
              <Button onClick={addOF} buttonText="ADD" style={buttonStyle} />
              <Button onClick={editOF} buttonText="Edit" style={buttonStyle} />
              <Button onClick={delOF} buttonText="Delete" style={buttonStyle} />
            </form>
          </div>

          <div id="buttons">
              <Button  buttonText="BACK" style={buttonStyle2} />
          </div>          

    </div>
  );

}

function ViewPossibleOffences(){

}

export default App;
