import '../index.js' 
import React from 'react';
import Button from '../button/button';
import Card from '../card/card.jsx';
import './menu.css';
import { Link } from 'react-router-dom';
import image from '../wits_logo.png';


const CARD_PROPS = [
    {
      header: "Lodge Academic Dishonesty ",
      description: "Brief description",
      button_description: "SUBMIT COMPLAINT",
      onclick : "/AcademicOffenceMenu" 
    }
   ,,
      {
        header: "",
        description: "",
        button_description: "",
        onclick : "",
      }
     ,
     {
        header: "",
        description: "",
        button_description: "",
        onclick : "",
      }
      ,
      {
        header: "",
        description: "",
        button_description: "",
        onclick : "",
      }
    
  ];



function Menu() { //this is the menu page - notice "/" in route, shows on startup
    let cards = [];
    


    const buttonStyle = {
        width: "50px",
        margin : "25px",
 
       
      }

    CARD_PROPS.forEach((prop, index) => {
      cards.push(<Card key={index} header={prop.header} description={prop.description} button_description={prop.button_description} onclick={prop.onclick}/>)
    });
    function Header1(props){
        return <h1> {props.text}</h1>;
        
    }
 

    return (
        <>
            <div className="App" >
                <div style={{ display: "flex", marginLeft: "15%" }}>
                    <img src={image} height={80} width={80} />
                    <Header1 text="WITS SUPPORT CENTRE" /> 
                    <Button buttonText="HELP" style={buttonStyle} />  
                    <Link to={"/Login"}>
                        <Button  buttonText="SIGN IN" style={buttonStyle} />
                    </Link>
                    
                </div>
                
            </div>
            
            <div className="column-wrapper">
                {cards}
            </div>
        </>  
        
  
    );
  }

  export default Menu;

