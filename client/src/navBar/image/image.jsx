import React from "react";
import "./image.css"

function Image(props){
return(
    <img className="imageWrapper" alt ="" src ={props.Image} onClick={props.action}></img>
);

}

export default Image;