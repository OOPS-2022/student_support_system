import React from "react";
import { TextField} from "@mui/material";

function Label(props){
    return(
        <TextField style ={{minWidth: "90%"}}
            id="outlined-name"
            label= {props.name}
            value={props.value}
          
            />
    );

}

export default Label;