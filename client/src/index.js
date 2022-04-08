
import ReactDOM from 'react-dom';
import App from './App';
import './App.css';
import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Menu from './menu/menu';
import AcademicOffenceMenu from './academicOffenceMenu/aofm';
import { FileUploader } from "react-drag-drop-files";
import styled from "styled-components";
import logo from './wits_logo.png';
import image from './wits_logo.png';
import Button from './button/button';


const buttonStyle2 = {
  minWidth: "10px",
  margin : "25px",
  backgroundColor :"white",
  color: "black",
}

const buttonStyle = {
  width: "50px",
  margin : "25px",
}

function Header1(props){
  return <h1> {props.text}</h1>;
}

ReactDOM.render(  // bellow will contain the paths to each page 
  <Router>
    <Routes>
      <Route path="/createlog" element={<CreateLog />} />
      <Route path="/menu" element={<Menu/>} />
      <Route path="/AcademicOffenceMenu" element={<AcademicOffenceMenu />} />
      <Route path="/viewSubmittedOffences" element={<ViewSubmittedOffences />} />
      <Route path="/viewPossibleOffences" element={<ViewPossibleOffences />} />
      <Route path = "/" element ={<CreateLogin />}/>
      <Route path = "/offencelist" element ={<EditOffences />}/>
    </Routes>
  </Router>,

  document.getElementById('root')
);


function CreateLog() {     // this is the create log page

  const [offenderName, setOffenderName] = useState("");
  const [offenceType, setOffenceType] = useState("-1");
  const [offenceDetails, setOffenceDetails] = useState("");
  const [offenceCode, setOffenceCode] = useState("");
  const [offenceLink, setOffenceLink] = useState("");
  const [offenceOther, setOffenceOther] = useState("");
  const [file, setFile] = useState(null);

  const [offenceNameList, setOffenceNameList] = useState([]); //save the file

  const fileTypes = ["JPG", "PDF"]; //allowed file types
  const handleChange = (file) => { //handle change for uploading file
    setFile(file);
  };


  function populateOffenceNameList() {
    Axios.get("http://localhost:3001/getOffenceNameList").then((response) => {
      setOffenceNameList(response.data);
    });
  }

  function proccessData() {

    if (offenderName === "" || offenceDetails === "" || offenceCode === "" ) {
      return false;
    }

    if (offenceType === "other" && offenceOther === "") {
      return false;
    }
    return true;
  }

  const submitLog = () => {
    if (!proccessData()) {
      alert("Please fill in all necessary details");
    } else {
      Axios.post("http://localhost:3001/createlog", {
        offenderName: offenderName,
        offenceType: offenceType,
        offenceDetails: offenceDetails,
        offenceCode: offenceCode,
        offenceLink: offenceLink,
        offenceOther: offenceOther,
      }).then((res) => {
        alert(res.data);
      });
    }
  }

  const [possible_offences, setPossibleOffences] = useState([]) //to display list of offences for admin to see while editing
    useEffect(() => {
      Axios.get('http://localhost:3001/viewPossibleOffences').then((response) => {
        setPossibleOffences(response.data)
      })
    }, [])
  
  return (

    <div className="App">
      <h1> CRUD App</h1>

      <div>
        <label>Offender name:</label>
        <input type="text" name="offenderName" onChange={(e) => {
          setOffenderName(e.target.value);
        }} />

        <p><b>Offence* :</b>

          <select id="offence_type" onChange={(e) => {
            setOffenceType(e.target.value);
          }} >
          {possible_offences.map((val) => {
          return <option>{val.offence_name}</option>
          })}
          <option>other</option>

          </select>
        </p>

        <form>
          Other : (please specify)
          <input type="text" name="offence_type_other" onChange={(e) => {
            setOffenceOther(e.target.value);
          }} />
        </form>

        <form>
          Details of offence* :
          <input type="text" name="offence_details" onChange={(e) => {
            setOffenceDetails(e.target.value);
          }} />
        </form>

        <form>
          Course Code* :
          <input type="text" name="course_code" onChange={(e) => {
            setOffenceCode(e.target.value);
          }} />
        </form>
          
        <form>
          Evidence* : 
          <FileUploader handleChange={handleChange} name="file" types={fileTypes} multiple='false'/>
            
        </form>
        <button onClick={() => {
          submitLog();
        }}>Create Log</button>
      </div>

    </div>

  );



}

function ViewSubmittedOffences() { //only for admin to see. see offences that have been logged
  const [logged_offences, setLoggedOffences] = useState([])
  const colNames = ["Offender Name", "Offence Name", "Course Code", "Status"];

  let navigate = useNavigate();

  function back(){
    navigate("/AcademicOffenceMenu");
 }

  useEffect(() => {
    Axios.get('http://localhost:3001/viewSubmittedOffences').then((response) => {
      setLoggedOffences(response.data)
    })
  }, [])

  
  function Table({logged_offences, colNames, width = "700px", height = "250px"}) {
    return (
      <div className="viewOffences">
            <table cellSpacing="20" style={{width: "700px", height: "250px"}}>
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
                    {Object.values(logged_offences).map((obj, index) => (
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

      <>
  
        <div className='viewOffences'>
  
                    <div style={{ display: "flex",}}>
  
                      <Button  buttonText="BACK" style={buttonStyle2} action={back} />
  
                    </div>
  
                    <div style={{ display: "flex", marginLeft: "23%" }}>
  
                        <img src={image} height={80} width={80} />
  
                        <Header1 text={"SUBMITTED OFFENCES"} />
  
                        <Button buttonText="HELP" style={buttonStyle}  />  
  
                       
  
                       
  
                    </div>
                    </div>

<div style={{ display: "flex",marginLeft: "15%"}}>
 <Table logged_offences={logged_offences} colNames={colNames} />
</div>
</>
);
}

function ViewPossibleOffences() { //for everyone to see. see offences that can be committed and their severity
  const [possible_offences, setPossibleOffences] = useState([])
  const colNames = ["Offence", "Severity"];

  let navigate = useNavigate();

  function back(){
    navigate("/AcademicOffenceMenu");
 }

  useEffect(() => {
    Axios.get('http://localhost:3001/viewPossibleOffences').then((response) => {
      setPossibleOffences(response.data)
    })
  }, [])

  function Table({possible_offences, colNames, width = "auto", height = "auto"}) {
    return (
      <div className="viewOffences">
            <table cellSpacing="20" style={{width: "500px", height: "250px"}}>
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
                    {Object.values(possible_offences).map((obj, index) => (
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

      <>
  
        <div className='viewOffences'>
  
                    <div style={{ display: "flex",}}>
  
                      <Button  buttonText="BACK" style={buttonStyle2} action={back} />
  
                    </div>
  
                    <div style={{ display: "flex", marginLeft: "23%" }}>
  
                        <img src={image} height={80} width={80} />
  
                        <Header1 text={"POSSIBLE OFFENCES"} />
  
                        <Button buttonText="HELP" style={buttonStyle}  />  
  
                       
  
                       
  
                    </div>
                    </div>

<div style={{ display: "flex",marginLeft: "22%"}}>
 <Table possible_offences={possible_offences} colNames={colNames} />
</div>
</>
);
}
                   

var user_info={};

export function sendUserInfo(){
    return user_info;
  }

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
        user_info=response.data;
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
      navigate("/menu");
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
  let navigate=useNavigate();

  const [possible_offences, setPossibleOffences] = useState([]) //to display list of offences for admin to see while editing
  useEffect(() => {
    Axios.get('http://localhost:3001/viewPossibleOffences').then((response) => {
      setPossibleOffences(response.data)
    })
  }, [])

 
    const [offencename,setOffencename]= useState("");
    const [severity,setSeverity] = useState("");
    
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
  
  
    const [arrList,setarrList] = useState([]);
    
    function changeSelect(name){
      Axios.post("http://localhost:3001/selectY",{offenceName: name}).then((response)=>{
          setarrList(response.data);
          console.log(response.data);
        });
    }
  
    function changeAdd(){
      if (offencename.length==0 || severity.length==0){
        alert("Please fill in details");
        return;
      }
      
      if(arrList.length>0){
        alert("exists");
      }
      else{
        let inum = parseInt(severity, 10);
        Axios.post("http://localhost:3001/insertY",{
          offenceName: offencename, 
          severity: inum,
        }).then(alert("Added"));
      }
      
    }
  
    function changeUpdate(){
      if (arrList.length>0){
        let inum = parseInt(severity, 10);
        Axios.post("http://localhost:3001/updateY",{
          offenceName: offencename, 
          severity: inum,
        }).then(alert("Updated"));
      }
      else{
        alert("name does not exist");
      }
      
    }
  
    function changeDelete(){
      if(arrList.length>0){
        Axios.post("http://localhost:3001/deleteY",{
          offenceName: offencename, 
        }).then(alert("deleted"));
      }
      else{
        alert("record does not exist");
      }
      
    }
  
    function back(){
      navigate("/AcademicOffenceMenu");
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

  function Table({possible_offences, colNames, width = "auto", height = "auto"}) {
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
                    {Object.values(possible_offences).map((obj, index) => (
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
              <Button buttonText="HELP" style={buttonStyle} >HELP</Button>         
            </div>
          </div>

          <div id="table">
            <Table possible_offences={possible_offences} colNames={colNames} />
          </div>
          
          <div id="inText">
            <p>
              Offence editing and adding:
            </p>
            
            <form id = "input1">
              <text>Offence name:</text>
              <input type="text" name="inOffence"  onChange={(e) => {
                setOffencename(e.target.value); 
                changeSelect(e.target.value);
                }}/> 
            </form>

            <form>
              <test>Severity level:</test>
              <input type="text" name="inSeverity"  onChange={(e) => {
                setSeverity(e.target.value); }}/> 
            </form>

            <form>
            
              <Button onClick={changeAdd} marginLeft="4px">add</Button>
              <Button onClick={changeUpdate} >edit</Button>
              <Button onClick={changeDelete}>delete</Button>
            
            </form>
          </div>

          <div id="buttons">
              <Button  buttonText="BACK" style={buttonStyle2} onClick={back}>BACK</Button>
          </div>          

    </div>
  );

}

export default App;
