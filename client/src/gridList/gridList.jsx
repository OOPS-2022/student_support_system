import React from 'react';
import Button from '../button/button';
import './gridList.css';
import { Link } from 'react-router-dom';


function GridList(props) {

  const buttonStyle = {
    width: "90%",
    maxWidth: "650px"
  }

  return (
    <>
      <div className="card shadow">
        <h1 className="header">{props?.header}</h1>

        <div className="descripton-wrapper" >
          <div className="description">
            <p>{props?.description}</p>
          </div>
        </div>

        <div className="bottom-div">
          <Button  buttonText= {props?.button_description} style={buttonStyle} action={props?.action}/>
        </div>

      </div>
    </>
  )

}


export default GridList;