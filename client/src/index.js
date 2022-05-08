
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
//import 'bootstrap/dist/css/bootsrap.css';
import {Viewer} from '@react-pdf-viewer/core';
import{defaultLayoutPlugin} from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import {Worker} from '@react-pdf-viewer/core';

import { Document, Page,pdfjs } from 'react-pdf';
//import './pdf.css'

//import pdfFile from '../../../server/Uploads/Pledges/SignedPledges/1650355918774Plagiarism Pledge.pdf'


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
      <Route path = "/createSignedPledge" element ={<CreateSignedPledge />}/>
      <Route path = "/viewPledges" element ={<ViewPledges />}/>
      <Route path = "/createTest" element ={<CreateTest />}/>
      <Route path = "/doTest" element ={<DoTest />}/>
      <Route path = "/testReport" element ={<TestReport />}/>
      <Route path = "/createClickedPledge" element ={<CreateClickedPledge />}/>

      <Route path="/oimenu" element={<OIMenu/>} />
      <Route path="/UploadEvidence" element={<UploadEvidence/>} />
      <Route path="/Schedule" element={<ScheduleMeetings/>} />
      <Route path="/SupportDocuments" element={<SupportingDocuments/>} />
      <Route path="/SRC" element={<SRC/>}/>
      <Route path = "/updateStudent" element ={<UpdateStudentstat/>}/>
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


  let navigate = useNavigate();
  function back(){
    navigate("/AcademicOffenceMenu");
 }

  function populateOffenceNameList() {
    Axios.get("http://localhost:3001/getOffenceNameList").then((response) => {
      setOffenceNameList(response.data);
    });
  }

  function proccessData() {

    if (offenderName === "" || offenceDetails === "" ) {
      return false;
    }

    if (offenceType == -1) {
      if(offenceOther === ""){
        return false;
      } else{
        offenceType = "other";
        return true;
      }
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
        submittedBy : localStorage.getItem("user_id"),
        currDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
        offenceStatus: "Pending"
      }).then((res) => {
        alert(res.data);
      });
    }
  }

  const [possible_offences, setPossibleOffences] = useState([]) //to display list of offences for admin to see while editing
    useEffect(() => {
      Axios.get('http://localhost:3001/offences').then((response) => {
        setPossibleOffences(response.data)
      })
    }, [])
  
  return (
<>
    <div className="App">
      <div style={{ display: "flex",}}>
                   <Button  buttonText="BACK" style={buttonStyle2} action={back} />
      </div>
             
      <div style={{ display: "flex", marginLeft: "25%" }}>
                      <img src={image} height={80} width={80} />
                      <Header1 text="CREATE LOG" /> 
                      <Button buttonText="HELP" style={buttonStyle} />
      </div>
    </div>
      <div className='block'>
        <div className='column-wrapper3'>


        
        <label style={{marginTop: "10px", fontSize: 22}}>Student Number:</label>
        <input type="text" name="offenderName" onChange={(e) => {
          setOffenderName(e.target.value);
        }} />

        <p style={{marginTop: "10px", fontSize: 22}}><b>Offence* :</b>

          <select select style={{marginTop: "10px", fontSize: 15}} id="offence_type" onChange={(e) => {
            setOffenceType(e.target.value);
          }} >
          {possible_offences.map((val) => {
          return <option>{val.offence_name}</option>
          })}
          <option value="5">other</option>

          </select>
        </p>

        <label style={{marginTop: "10px", fontSize: 22}}>
          Other : (please specify)</label>
          <input type="text" name="offence_type_other" onChange={(e) => {
            setOffenceOther(e.target.value);
          }} />
        

        <label style={{marginTop: "10px", fontSize: 22}}> Details of offence* :</label> 
          <input type="text" name="offence_details" onChange={(e) => {
            setOffenceDetails(e.target.value);
          }} />

        <label style={{marginTop: "10px", fontSize: 22}}>  Course Code* :</label>
          <input type="text" name="course_code" onChange={(e) => {
            setOffenceCode(e.target.value);
          }} />
        
          
        <label style={{marginTop: "10px", fontSize: 22}}>  Evidence* :</label>  
          <FileUploader handleChange={handleChange} name="file" types={fileTypes} multiple='false'/>
            
        

         <div className = "wrapper">
            <Button buttonText={"CREATE"} style={{width: "50px",marginTop: "10px"}} action={submitLog} />
          </div>
      </div>

    </div>
</>
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
  const colNames = ["Offence", "Description","Severity"];

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
                        <th key = {index} >
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

function CreateLogin(){
  const [lgEmail, setlgEmail] = useState("");
  const [lgPassword, setlgPassword] = useState("");
  var lgcUser_id ="";
  var lgRole ="";
  const navigate = useNavigate();

  function checkPassEmail(){
    if(lgPassword == ""){
     alert('Please type username and password');
     return;
   }
   Axios.post("http://localhost:3001/apiLogin/getInfo",{setlgEmail: lgEmail, setlgPassword: lgPassword }).then((response)=>{
        if(response.data != "incorrect"){
          lgcUser_id = response.data[0]["user_id"];
          lgRole =response.data[0]["role"];
          localStorage.setItem("user_id",lgcUser_id );
          localStorage.setItem("user_role",lgRole );
          navigate("/menu");
        }else{
          alert("The email or password is incorrect");
          console.log("incorrect");
        }
        console.log(response.data);
      });
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
        setlgEmail(e.target.value); }}/>
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
  const colNames = ["Offence", "Description","Severity"];
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

function CreateSignedPledge(){
  const [file, setFile]=useState({})
  const [name, setName]=useState("")
  const [desc, setDesc]=useState("")

  const fileChange=(event)=>{
    setFile(event.target.files[0]);
  };

 

  const upload=(event)=>{
    let formData=new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("desc", desc);
    console.log(formData);
    fetch("http://localhost:3001/createSignedPledge", {
      method: "post",
      body: formData
    })
  };
  
  return (
    <div className='App'>
      <input type="file" onChange={fileChange}/>
      <lable>Name of pledge</lable>
      <input type="text" name="name" onChange={(e) => {
          setName(e.target.value);
        }} />
      <label>Description</label>
      <input type="text" name="description" onChange={(e) => {
          setDesc(e.target.value);
        }} />
      <button onClick={upload}>upload</button>
    </div>
  )
}

function ViewPledges(){
  const [pledges, setPledges]=useState([]);
  const [viewId, setViewId]=useState(3);
  

  useEffect(() => {
    Axios.get('http://localhost:3001/viewPledges').then((response) => {
      setPledges(response.data)
    })
  }, [])

  const viewPDF = (event)=>{
    setViewId(3);
    Axios('http://localhost:3001/viewFile', {
    method: 'GET',
    responseType: 'blob', //Force to receive data in a Blob Format
    params: {'id': viewId}
  })
  .then(response => {
  //Create a Blob from the PDF Stream
    const file = new Blob(
      [response.data], 
      {type: 'application/pdf'});
      console.log(response)
    //Build a URL from the file
    const fileURL = URL.createObjectURL(file);
    //Open the URL on new Window
    window.open(fileURL);
  })
  .catch(error => {
    console.log(error);
  });
  }
  console.log(pledges)



  return(
    
    <div className='App'>
      <h1>View Pledges</h1>
      <h3>View Pdf</h3>
      <button onClick={viewPDF}>View PDF</button>
      <div className='pdf-container'>

      </div>
    </div>
    
  )

}

function CreateTest(){
  const [pledges, setPledges]=useState([]);
  const [testName, setTestName]=useState("");
  const [pledgeID, setPledgeID]=useState("3");
  const [courseCode, setCourseCode]=useState("");
  const [testDate, setTestDate]=useState("");

  useEffect(() => {
    Axios.get('http://localhost:3001/viewPledges').then((response) => {
      setPledges(response.data)
    })
  }, [])

  const createTest=(event)=>{
    Axios.post("http://localhost:3001/createTest", {
      testName : testName,
      pledgeID: pledgeID,
      courseCode: courseCode,
      testDate:testDate,
      creatorID: 4 //change later using local storage or whatever
    }).then((res) => {
      alert(res.data);
      });
  }

  return(
    <div className='App'>
      <div>
        <label>Test name:</label>
        <input type='text' onChange={(e)=>{setTestName(e.target.value)}}/>
        <br></br>
        <label>Course code:</label>
        <input type='text' onChange={(e)=>{setCourseCode(e.target.value)}}/>
        <br></br>
        <label>Test Date:</label>
        <input type='text' onChange={(e)=>{setTestDate(e.target.value)}}/>
        <br></br>
        <label>Please choose pledge:  </label>
        <select select style={{marginTop: "10px", fontSize: 15}} id="pledge_name" onChange={(e) => {
            setPledgeID(e.target.value);
          }} >
          {pledges.map((val) => {
          return <option value={val.pledge_id}>{val.pledge_name} ({val.pledge_type})</option>
          })}
          </select>
          <button onClick={createTest}>Submit:</button>
      </div>
    </div>
  );
}

function DoTest(){ //for now do default test id=2, extend to stuff later, this is where student will upload their signed pledge after viewing the pledge they have to sign
  const [paragraph, setParagraph]=useState("");
  const [file, setFile]=useState({}); //file uploaded by student if signed pledge
  const [message, setMessage]=useState(""); //the plege message if clicked pledge
  const [type, setType]=useState(""); //type of pledge

  //first get whether the test has a signed or clicked pledge. This will determine what the frontend shows
  useEffect(()=>{
    Axios('http://localhost:3001/pledgeType', {
    method: 'GET',
    params: {'testID': 4}
    }).then(response=>{
    setType(response.data.pledge_type);
    setMessage(response.data.pledge_desc);
    })
  },[])
  
  if(type=="Clicked Pledge"){

  }

  //viewing the signed pledge they have to download and sign. Not to be seen if clicked pledge
  const view=(event)=>{
   Axios('http://localhost:3001/testPledge', {
    method: 'GET',
    responseType: 'blob', //Force to receive data in a Blob Format
    params: {'testID': 2}
  })
  .then(response => {
  //Create a Blob from the PDF Stream
    const file = new Blob(
      [response.data], 
      {type: 'application/pdf'});
      console.log(response)
    //Build a URL from the file
    const fileURL = URL.createObjectURL(file);
    //Open the URL on new Window
    window.open(fileURL);
  })
  .catch(error => {
    console.log(error);
  });
  }
  
  //Only if have to upload signed plegde
  const fileChange=(event)=>{
    setFile(event.target.files[0]);
  };

  //uploading signed pledge
  const upload=(event)=>{
    let formData=new FormData();
    formData.append("file", file);
    formData.append("paragraph", paragraph);
    formData.append("studentID", 3); //hardcoded for now. Get id from user login
    formData.append("testID", 2); //also hardcoded for now
    fetch("http://localhost:3001/doTest", {
      method: "post",
      body: formData
    })
  };

  //raw html code to embed onto do test if there is a clicked pledge
  const rawHTML = `
  <div>
    <label>
    <input type="checkbox" id="myCheck">
    `+message +`</label>
    <div>
    </div>
  </div>
  `;

  return(
    <div className='App'>
      <label>Please write a paragraph to show your understanding of the pledge:</label>
      <br></br>
      <textarea id="story" name="story" rows="5" cols="33" onChange={(e)=>setParagraph(e.target.value)}/>
      <br></br>
      <label>Please upload your signed pledge here:</label>
      <br></br>
      <input type="file" onChange={fileChange}/>
      <br></br>
      <button onClick={upload}>upload</button>
      <button onClick={view}>View pledge</button>
      <div dangerouslySetInnerHTML={{ __html: rawHTML }}></div>
    </div>
  )
}

function TestReport(){
  const [signedPledges, setSignedPledges]=useState([]);
  const [testID, setTestID]=useState(2);
  const [userID, setUserID]=useState(3);

  useEffect(()=>{
    Axios('http://localhost:3001/testReport', {
    method: 'GET',
    params: {'testID': 2}
    }).then(response=>{
    setSignedPledges(response);
    })
  },[])
  
  const viewPDF = (event)=>{
    //setViewId(3);
    Axios('http://localhost:3001/viewSignedPledge', {
    method: 'GET',
    responseType: 'blob', //Force to receive data in a Blob Format
    params: {'testID': testID, 'userID':userID}
  })
  .then(response => {
  //Create a Blob from the PDF Stream
    const file = new Blob(
      [response.data], 
      {type: 'application/pdf'});
      console.log(response)
    //Build a URL from the file
    const fileURL = URL.createObjectURL(file);
    //Open the URL on new Window
    window.open(fileURL);
  })
  .catch(error => {
    console.log(error);
  });
  }
  console.log(signedPledges);

  return(
    
    <div className='App'>
      <h1>View Signed Pledges for test</h1>
      <h3>View Pdf</h3>
      <button onClick={viewPDF}>View PDF</button>
    </div>
    
  )
}

function CreateClickedPledge(){

  const [message, setMessage]=useState("");
  const [name, setName]=useState("");

  const rawHTML = `
  <div>
    <label>
    <input type="checkbox" id="myCheck">
    `+message +`</label>
    <div>
    </div>
  </div>
  `;

  const upload=(event)=>{
    Axios.post("http://localhost:3001/createClickedPledge", {
      name: name,
      desc: message
    }).then((res) => {
      alert(res.data);
      });
  };

  return(
    <div className='App'>
      <h1>Create Clicked Pledge</h1>
        <label>What do you want your clicked pledge to say?</label>
        <br></br>
        <textarea id="story" name="story" rows="5" cols="33" onChange={(e)=>setMessage(e.target.value)}/> 
        <br></br>
        <label>Name of your pledge:</label>
        <input type='text'onChange={(e)=>setName(e.target.value)}/>
        <h2> Preview of your clicked pledge:</h2>
        <div dangerouslySetInnerHTML={{ __html: rawHTML }}></div>
      <button onClick={upload}>Upload</button>
    </div>
  )
}



//++++++++++++++++++++++++++++++++++++++++++++++Sprint 2+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function OIMenu(){
 
  function Header1(props){
    return <h1> {props.text}</h1>;
  }
  const buttonStyle = {
    width: "60px",
    margin : "25px",
  }
  let navigate = useNavigate();
    function UE(){
      navigate("/UploadEvidence");
   }
  
   function SM()
   {
     navigate("/Schedule")
   }
  
   function SD()
   {
    navigate("/SupportDocuments")
   }

   function SRC()
  {
    navigate("/SRC")
  }
   
  
  const Button = styled.button`
  background-color: rgb(14,71,161);
  min-width: 10rem;
  height: 2rem;
  color: white;
  cursor: pointer;
  border-radius: 4px;
  `;
  
  const Optbutton = styled.button`
  background-color: rgb(14,71,161);
  min-width: 12rem;
  height: 4rem;
  color: white;
  cursor: pointer;
  border-radius: 4px;
  `;
  return (
    <div id="head">
    <div style={{ display: "flex", marginLeft: "20%" }}>
      <img src={logo} height={80} width={80} />
      <Header1 text="COMMITEE INVESITGATION: THE OFFENSE" />
      <Button style={buttonStyle}>HELP</Button> 
    </div>
  
    <div style={{ display: "flex", marginBottom: "5%" }}> </div>
    <div style={{ display: "flex", marginLeft: "45%" }}>
    <Optbutton  onClick={UE} >Upload Evidence</Optbutton>
    </div>
  
    <div style={{ display: "flex", marginBottom: "5%" }}> </div>
    <div style={{ display: "flex", marginLeft: "45%" }}>
    <Optbutton  onClick={SD} >Upload Supporting Documents</Optbutton>
    </div>
  
    <div style={{ display: "flex", marginBottom: "5%" }}> </div>
    <div style={{ display: "flex", marginLeft: "45%" }}>
    <Optbutton  onClick={SM} >Schedule Meetings</Optbutton>
    </div>

    <div style={{ display: "flex", marginBottom: "5%" }}> </div>
    <div style={{ display: "flex", marginLeft: "45%" }}>
    <Optbutton  onClick={SRC} >SRC help</Optbutton>
    </div>
  
  </div>
  );
}// end of menu return 

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
}// end of table function

function SupportingDocuments()
  {
    const [logged_offences, setLoggedOffences] = useState([])
    const colNames = ["Ticket ID", "Offender Name", "Offence Discription", "Course Code", "Status"];

    const [ticket_id,setTicket_id]= useState("");
    const [offence_status,setOffence_status] = useState("Not Guilty");

    useEffect(() => {
      Axios.get('http://localhost:3001/SupportingDocuments').then((response) => {
        setLoggedOffences(response.data)
      })
    }, [])

  
    const [file, setFile] = useState(null);
    const fileTypes = ["JPG", "PDF"]; //allowed file types
      const handleChange = (file) => { //handle change for uploading file
        setFile(file);
      };
    function Header1(props){
      return <h1> {props.text}</h1>;
    }
    const buttonStyle = {
      width: "60px",
      margin : "25px",
    }
    
    const Button = styled.button`
    background-color: rgb(14,71,161);
    min-width: 10rem;
    height: 2rem;
    color: white;
    cursor: pointer;
    border-radius: 4px;
    `;
    
    const Optbutton = styled.button`
    background-color: rgb(14,71,161);
    min-width: 12rem;
    height: 4rem;
    color: white;
    cursor: pointer;
    border-radius: 4px;
    `;
  
    const [student, setStudent] = React.useState('null');
    const [outcome, setOutcome] = React.useState('null');

    const [possible_users, setPossibleUsers] = useState([]) //to display list of offender names
    useEffect(() => {
      Axios.get('http://localhost:3001/getOffenderNames').then((response) => {
        setPossibleUsers(response.data)
      })
    }, [])

    const [possible_tickets, setPossibleTickets] = useState([]) //to display list of tickets
    useEffect(() => {
      Axios.get('http://localhost:3001/getTicketids').then((response) => {
        setPossibleTickets(response.data)
      })
    }, [])
  
    const handleStudentChange = (event) => {
      setStudent(event.target.value);
    };
  
    const handleOutcomeChange = (event) => {
      setOutcome(event.target.value);
    };
    const Dropdown = ({ label, value, options, onChange }) => {
      return (
        <label>
          {label}
          <select value={value} onChange={onChange}>
            {options.map((option) => (
              <option value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
      );
    };

    function changeUpdate(){
      if (ticket_id.length==0){
        alert("Please fill in details");
        return;
      }
      console.log(offence_status);
      let inum = parseInt(ticket_id, 10);
        Axios.post("http://localhost:3001/updateOI",{
          ticket_id: inum, 
          offence_status: offence_status,
        }).then(alert("Updated"));
        window.location.reload(1);
    }
    
    const handleStatusChange = (event) => {
      setOffence_status(event.target.value);
    };


      

    return (
      <div id="head">
      <div style={{ display: "flex", marginLeft: "20%" }}>
        <img src={logo} height={80} width={80} />
        <Header1 text="COMMITEE INVESITGATION: THE OFFENSE" />
        <Button style={buttonStyle}>HELP</Button> 
      </div>
      <div style={{ display: "flex", marginBottom: "1%" }}></div>
      <div style={{ display: "flex", marginLeft: "42%" }}>Please select student being investigated: </div>
      <div style={{ display: "flex", marginBottom: "1%" }}></div>
      <div style={{ display: "flex", marginLeft: "37%" }}> 
      <select select style={{marginTop: "10px", fontSize: 15}} id="user_ids" onChange={(e) => {
            setStudent(e.target.value);
          }} >
            <option>choose offender name</option>
          {possible_users.map((val) => {
          return <option>{val.offender_name}</option>
          })}
          </select>
  
           </div>
  
           <div style={{ display: "flex", marginBottom: "1%" }}></div>
      
      <div id="table">
        <Table possible_offences={logged_offences} colNames={colNames} />
      </div>
      
      <div style={{ display: "flex", marginLeft: "42%" }}>Please edit outcome of offense: </div>
      <div style={{ display: "flex", marginBottom: "1%" }}></div>
      <form>
          <div style={{ display: "flex", marginLeft: "37%" }}>
          <select select style={{marginTop: "10px", fontSize: 15}} id="ticket_ids" onChange={(e) => {
            setTicket_id(e.target.value);
          }} >
            <option>choose ticket id</option>
          {possible_tickets.map((val) => {
          return <option>{val.ticket_id}</option>
          })}
         
          </select>
                  </div>
                  </form>
                
                  <div style={{ display: "flex", marginBottom: "1%" }}></div>
                  <div style={{ display: "flex", marginLeft: "37%" }}>
      
      
      

      <Dropdown
          label="Choice:"
          options={[
            { label: 'Not Guilty', value: 'Not Guilty' },{ label: 'Pending', value: 'Pending' },{ label: 'Guilty', value: 'Guilty' }
          ]}
          //value={Choice}
        onChange={handleStatusChange}
        />              
      
      <Button onClick={changeUpdate}>Edit</Button> </div>
     
    </div>
    
  
    );
  
}// end of supporting docs

function UploadEvidence()
  {
    const [logged_offences, setLoggedOffences] = useState([])
    const colNames = ["Ticket ID", "Offender Name", "Offence Discription", "Course Code", "Status"];
    useEffect(() => {
      Axios.get('http://localhost:3001/SupportingDocuments1').then((response) => {
        setLoggedOffences(response.data)
      })
    }, [])

    const [file, setFile]=useState({})
    const [name, setName]=useState("")
    const [desc, setDesc]=useState("")
  
    const fileChange=(event)=>{
      setFile(event.target.files[0]);
    };
  
    const upload=(event)=>{
      let formData=new FormData();
      formData.append("file", file);
      formData.append("name", name);
      formData.append("desc", desc);
      console.log(formData);
      fetch("http://localhost:3001/UploadEvidence", {
        method: "post",
        body: formData
      })
    };
  
    function Header1(props){
      return <h1> {props.text}</h1>;
    }
    const buttonStyle = {
      width: "60px",
      margin : "25px",
    }
    
    const Button = styled.button`
    background-color: rgb(14,71,161);
    min-width: 10rem;
    height: 2rem;
    color: white;
    cursor: pointer;
    border-radius: 4px;
    `;
    
    const Optbutton = styled.button`
    background-color: rgb(14,71,161);
    min-width: 12rem;
    height: 4rem;
    color: white;
    cursor: pointer;
    border-radius: 4px;
    `;
  
    return (
      <div id="head">
      <div style={{ display: "flex", marginLeft: "20%" }}>
        <img src={logo} height={80} width={80} />
        <Header1 text="COMMITEE INVESITGATION: THE OFFENSE" />
        <Button style={buttonStyle}>HELP</Button> 
      </div>
      <div style={{ display: "flex", marginLeft: "37%" }}> Please upload any evidence pertaining to student: </div>
      <div style={{ display: "flex", marginBottom: "2%" }}></div>
      <div style={{ display: "flex", marginLeft: "37%" }}>
  
      <div>
        <input type="file" onChange={fileChange}/>
        <lable>Evidence File Name:</lable>
        <input type="text" name="name" onChange={(e) => {
            setName(e.target.value);
          }} />
        <label>Description of Evidence File:</label>
        <input type="text" name="description" onChange={(e) => {
            setDesc(e.target.value);
          }} />
        <button onClick={upload}>upload</button>
      </div>
          
      </div>
    
      <div id="table">
        <Table possible_offences={logged_offences} colNames={colNames} />
      </div>

    </div>
  
    );
}// end of upload evidence

function ScheduleMeetings(){
    const colNames = ["Student Number", "Date","Meeting"];
    
    const [possible_meetings, setPossibleMeetings] = useState([]) //to display list of offences for admin to see while editing
    useEffect(() => {
      Axios.get('http://localhost:3001/Schedule').then((response) => {
        setPossibleMeetings(response.data)
      })
    }, [])

    const [studNo,setStudNo]= useState("");
    const [meetDate,setMeetDate] = useState("");
    const [meetLink,setMeetLink] = useState("");

    const [arrList,setarrList] = useState([]);
    
    function changeSelect(name){
      Axios.post("http://localhost:3001/selectOI",{studNo: name}).then((response)=>{
          setarrList(response.data);
          console.log(response.data);
        });
    }
    //--------------------------------------------------------------------------------------button add function
    function changeAdd(){
      if ( meetLink.length==0 || studNo.length == 0 ){
        alert("Please fill-in/choose all details");
        return;
      }
      
      console.log(year +"-"+month + "-"+ day);
      console.log(studNo);
      console.log(meetLink);
      Axios.post("http://localhost:3001/insertOI",{
          studNo: studNo, 
          meetDate: year +"-"+month + "-"+ day,
          meetLink: meetLink,
        }).then(alert("Added"));

        window.location.reload(1);
    }

    //--------------------------------------------------------------------------------------button delete function
  
    function changeDelete(){
      if (studNo.length==0 ){
        alert("Please fill in details");
        return;
      }
      console.log(year +"-"+month + "-"+ day);
      console.log(studNo);
      console.log(meetLink);
      Axios.post("http://localhost:3001/deleteOI",{
          studNo: studNo,
          meetDate: year +"-"+month + "-"+ day, 
        }).then(alert("deleted"));

        window.location.reload(1);
    }

    // displays
    const [day, setDay] = React.useState('01');
    const [month, setMonth] = React.useState('01');
    const [year, setYear] = React.useState('2022');
    const [student, setStudent] = React.useState('1');
    const [link, setLink] = React.useState('');
    const Dropdown = ({ label, value, options, onChange }) => {
      return (
        <label>
          {label}
          <select value={value} onChange={onChange}>
            {options.map((option) => (
              <option value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
      );
    };

    //grab data from front end
    const handleDayChange = (event) => {
      setDay(event.target.value);
    };
    const handleLinkChange = (event) => {
      setLink(event.target.value);
    };
    const handleStudentChange = (event) => {
      setStudent(event.target.value);
    };
  
    const handleMonthChange = (event) => {
      setMonth(event.target.value);
    };
  
    const handleYearChange = (event) => {
      setYear(event.target.value);
    };
    function Header1(props){
      return <h1> {props.text}</h1>;
    }
    const buttonStyle = {
      width: "60px",
      margin : "25px",
    }
    
    const Button = styled.button`
    background-color: rgb(14,71,161);
    min-width: 10rem;
    height: 2rem;
    color: white;
    cursor: pointer;
    border-radius: 4px;
    `;

    
    const [possible_users, setPossibleUsers] = useState([]) 
    useEffect(() => {
      Axios.get('http://localhost:3001/getUserids').then((response) => {
        setPossibleUsers(response.data);
        
      })
    }, [])
  
    return (
      <div id="head">
      <div style={{ display: "flex", marginLeft: "20%" }}>
        <img src={logo} height={80} width={80} />
        <Header1 text="COMMITEE INVESITGATION: THE OFFENSE" />
        <Button style={buttonStyle}>HELP</Button> 
      </div>
      <div style={{ display: "flex", marginBottom: "2%" }}></div>
      <div style={{ display: "flex", marginLeft: "42%" }}>Please select date of meeting: </div>

      <div style={{ display: "flex", marginBottom: "1%" }}></div>
      <div style={{ display: "flex", marginLeft: "37%" }}> <Dropdown
          label="Day:"
          options={[
            { label: '1', value: '01' },{ label: '2', value: '02' },{ label: '3', value: '03' },
            { label: '4', value: '04' },{ label: '5', value: '05' },{ label: '6', value: '06' },
            { label: '7', value: '07' },{ label: '8', value: '08' },{ label: '9', value: '09' },
            { label: '10', value: '10' },{ label: '11', value: '11' },{ label: '12', value: '12'},
            { label: '13', value: '13' },{ label: '14', value: '14' },{ label: '15', value: '15' },
            { label: '16', value: '16' },{ label: '17', value: '17' },{ label: '18', value: '19' },
            { label: '20', value: '20' },{ label: '21', value: '21' },{ label: '22', value: '22' },
            { label: '23', value: '23' },{ label: '24', value: '24' },{ label: '25', value: '25'},
            { label: '26', value: '26' },{ label: '27', value: '27' },{ label: '28', value: '29' },
            { label: '30', value: '30' },{ label: '31', value: '31' }
          ]}
          value={day}
          onChange={handleDayChange}
        />
  
        <Dropdown
          label="Month"
          options={[
            { label: 'January', value: '01' },
            { label: 'February', value: '02' },
            { label: 'March', value: '03' },
            { label: 'April', value: '04' },
            { label: 'May', value: '05' },
            { label: 'June', value: '06' },
            { label: 'July', value: '07' },
            { label: 'August', value: '08' },
            { label: 'September', value: '09' },
            { label: 'October', value: '10' },
            { label: 'November', value: '11' },
            { label: 'December', value: '12' },
          ]}
          value={month}
          onChange={handleMonthChange}
        />
  
  <Dropdown
          label="Year"
          options={[
            { label: new Date().getFullYear(), value: new Date().getFullYear()},
            {  label: new Date().getFullYear()+1, value: new Date().getFullYear()+1}
          ]}
          value={year}
          onChange={handleYearChange}
          
        />
           
          </div>
          <div style={{ display: "flex", marginBottom: "1%" }}></div>
          <div style={{ display: "flex", marginLeft: "42%" }}>Please provide link to recorded meeting: </div>
          <div style={{ display: "flex", marginBottom: "1%" }}></div>
          <form>
          <div style={{ display: "flex", marginLeft: "42%" }}>
                  <input type = 'text' onChange=
                  { 
                    (e) => {

                      setMeetLink(e.target.value);
                    }
                  } 
                  defaultValue = {null}/> 
          </div></form>
          
          <div style={{ display: "flex", marginBottom: "1%" }}></div>
      <div style={{ display: "flex", marginLeft: "42%" }}>Please select student being investigated: </div>

      <div style={{ display: "flex", marginLeft: "42%" }}>
      <select select style={{marginTop: "10px", fontSize: 15}} id="user_ids" onChange={(e) => {
            setStudNo(e.target.value);
          }} >
            <option>choose user id</option>
          {possible_users.map((val) => {
          return <option>{val.user_id}</option>
          })}
         
          </select>
                  </div>
      
      { /* <div style={{ display: "flex", marginBottom: "1%" }}></div>
      <div style={{ display: "flex", marginLeft: "37%" }}> <Dropdown
          label="Student:"
          options={[
            { label: 'null', value: 'null' }
          ]}
          value={student}
          onChange={handleStudentChange}
        />
        </div> */ }

           <div id="table">
            <Table possible_offences={possible_meetings} colNames={colNames} />
           </div>
           <div style={{ display: "flex", marginLeft: "35%" }}>
           <Button onClick={changeAdd}>Add</Button> </div>
           <div style={{ display: "flex", marginBottom: "1%" }}></div>
           <div style={{ display: "flex", marginLeft: "35%" }}>
           <Button onClick={changeDelete}>Delete</Button> </div>
           
  
       {/*<p>Day:{day} Month:{month} Year:{year}</p>*/}
        
       
    </div>
    );
}// end of schedule meetings 

//IMPORTANT needs user email or user id  
function SRC(){
    function Header1(props){
      return <h1> {props.text}</h1>;
    }
    const buttonStyle = {
      width: "60px",
      margin : "25px",
    }
    
    const Button = styled.button`
    background-color: rgb(14,71,161);
    min-width: 10rem;
    height: 2rem;
    color: white;
    cursor: pointer;
    border-radius: 4px;
    `;

    function sendSRC(){
      //console.log(2);
      Axios.post("http://localhost:3001/sendmail").then(alert("Added"));
    }

    function btnSend(){
      console.log(1);
      sendSRC();
    }

    return (
      <div id="head">
      <div style={{ display: "flex", marginLeft: "20%" }}>
        <img src={logo} height={80} width={80} />
        <Header1 text="COMMITEE INVESITGATION: THE OFFENSE" />
        <Button style={buttonStyle}>HELP</Button> 
      </div>
  
      <div style={{ display: "flex", marginBottom: "2%" }}></div>
      <div style={{ display: "flex", marginLeft: "32%" }}>If applicable please select the option to contact SRC at src.academics@students.wits.ac.za</div>
      <div style={{ display: "flex", marginBottom: "2%" }}></div>
      <div style={{ display: "flex", marginLeft: "46%" }}> </div>
      <Button onclick={sendSRC}>Contact SRC</Button>
      </div>
    );
    
}//end of src email 


function UpdateStudentstat()
{
  function Header1(props){
    return <h1> {props.text}</h1>;
  }
  const buttonStyle = {
    width: "60px",
    margin : "25px",
  }
  
  const Button = styled.button`
  background-color: rgb(14,71,161);
  min-width: 10rem;
  height: 2rem;
  color: white;
  cursor: pointer;
  border-radius: 4px;
  `;

  const [logged_offences, setLoggedOffences] = useState([])
  const colNames = ["Ticket ID", "Offender Name", "Offence Discription", "Course Code", "Status"];

  useEffect(() => {
    Axios.get('http://localhost:3001/SupportingDocuments').then((response) => {
      setLoggedOffences(response.data)
    })
  }, [])



  return (
    <div id="head">
    <div style={{ display: "flex", marginLeft: "20%" }}>
      <img src={logo} height={80} width={80} />
      <Header1 text="Status" />
      <Button style={buttonStyle}>HELP</Button> 
    </div>
    <div style={{ display: "flex", marginBottom: "1%" }}></div>
    <div style={{ display: "flex", marginLeft: "42%" }}>Please view status of offenses</div>
    <div id="table">
            <Table possible_offences={logged_offences} colNames={colNames} />
           </div>

    </div>
  );
  
}// end of updatestudent

export default App;
