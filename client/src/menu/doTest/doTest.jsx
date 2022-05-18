import React,{useState, useEffect} from "react";
import "../page.css"
import { MenuItem, TextField, Button } from "@mui/material";
import Axios from 'axios';
import "./doTest.css"

export default function DoTest(){ //for now do default test id=2, extend to stuff later, this is where student will upload their signed pledge after viewing the pledge they have to sign
    const [paragraph, setParagraph]=useState("");
    const [file, setFile]=useState({}); //file uploaded by student if signed pledge
    const [message, setMessage]=useState(""); //the plege message if clicked pledge
    const [type, setType]=useState(""); //type of pledge
    const [checked, setChecked] = useState("");

    const validate = () =>{
      if(paragraph == ""){
        alert("Please give a description of your undestanding.");
        return false;
      }
      if(file == null){
        alert("Please upload a file");
        return false;
      }
      return true ;
    }

    const check = () =>{
      setChecked(true);
    }
    //first get whether the test has a signed or clicked pledge. This will determine what the frontend shows
    useEffect(()=>{
      Axios('http://localhost:3001/pledgeType', {
      method: 'GET',
      params: {'testID': 2}
      }).then(response=>{
      setType(response.data.pledge_type);
      setMessage(response.data.pledge_desc);
      })
    },[])
    
    
    
  
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
      if(validate()){
      let formData=new FormData();
      formData.append("file", file);
      formData.append("paragraph", paragraph);
      formData.append("studentID", 3); //hardcoded for now. Get id from user login
      formData.append("testID", 2); //also hardcoded for now
      fetch("http://localhost:3001/doTest", {
        method: "post",
        body: formData
      })
    }
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
      <div className='pageWrapper'>
          <div className=" testForm">
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
      </div>
    )
  }