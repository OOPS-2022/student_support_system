import React from "react";
import { Button } from "@mui/material";


function Btn(props){
    return(
       
         <Button style ={{color: "white"}}role ="button" variant = "text"  onClick={() => props?.action()}>{props.description}</Button>
     
    );
}

export default Btn;