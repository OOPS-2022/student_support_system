import '../index.js' 
import React from 'react';
import Button from '../button/button';
import './aofm.css';
import { Link } from 'react-router-dom';
import image from '../wits_logo.png';
import GridList from '../gridList/gridList.jsx';
import { useNavigate } from "react-router-dom";



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

function Header1(props){
    return <h1> {props.text}</h1>;
    
}


function AcademicOffenceMenu(){
  let navigate = useNavigate();
  var role= localStorage.getItem("user_role")
  if (role==null){
    navigate("/");
  }
  
  const gridList_props = [{header: "Log Offence", button_description: "LOG", action: () =>  navigate("/createLog"),},,
  {header: "View Offences", button_description: "VIEW", action: () =>  navigate("/viewPossibleOffences"), } ];  
  if (role =="admin"){ 
    gridList_props.push(  
      {header: "View Submissions", button_description: "VIEW", action: () =>  navigate("/viewSubmittedOffences"),  } ) 
      gridList_props.push({header: "Edit Offences", button_description: "EDIT", action: () =>  navigate("/offencelist"),})
  };

let gridList = [];

gridList_props.forEach((prop, index) => {
    gridList.push(<GridList key={index} header={prop.header} description={prop.description} button_description={prop.button_description} action={prop.action}/>)
  });

  return (
        <>
            <div className="App" >
                <div style={{ display: "flex",}}>
                     <Link to={"/"}>
                        <Button  buttonText="BACK" style={buttonStyle2} />
                    </Link>
                </div>
                <div style={{ display: "flex", marginLeft: "20%" }}>
                    <img src={image} height={80} width={80} />
                    <Header1 text="ACADEMIC OFFENCE MENU" /> 
                    <Button buttonText="HELP" style={buttonStyle} />  
                    
                    
                </div>
                
            </div>
            
            <div className="column-wrapper2" >
                {gridList}
            </div>
        </>  
        
  
    );
  }

export default AcademicOffenceMenu;