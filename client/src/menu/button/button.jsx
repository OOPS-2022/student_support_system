import React from "react";
import { Button } from "@mui/material";


function Btn(props){
    return(
       
         <Button variant = "text"  onClick={() => props?.action()}>{props.description}</Button>
     
    );
}

export default Btn;