import React from "react";
import { TextField} from "@mui/material";

function Select(props){
    return(
        <TextField style ={{minWidth: "90%"}}
            id="outlined-name"
            label= {props.name}
            value={props.value}
            select
        >
            {props.values.map((option) => (
            <option key={option.offence_} value={option.value}>
              {option.label}
            </option>
            ))}
        </TextField>
    );

}

export default Select;