import React from "react";
import { TextField} from "@mui/material";

function Multiline(props){
    return(
        <TextField style ={{minWidth: "90%"}}
            id="outlined-name"
            label= {props.name}
            value={props.value}
            multiline
            minRows={4}
          
            />
    );

}

export default Multiline;