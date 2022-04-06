import React from 'react';
import './App.css';
import image from './wits_logo.png';

const list = [{Offence: "Copy", Severity: 1}, {Offence: "Cheat", Severity: 3}, {Offence: "Plaig", Severity: 2}, {Offence: "test", Severity: 100}]

function Table({list, colNames}) {
  return (
    <div className="App">
          <table cellSpacing="20" style={{width: "center", height: "center"}}>
                <thead>
                  <tr>
                    {colNames.map((headerItem, index) =>  (
                      <th key = {index}>
                        {headerItem.toUpperCase()} 
                      </th>
                    ))}
                  </tr>
                </thead>  

                <tbody>
                  {Object.values(list).map((obj, index) => (
                    <tr key={index}>
                      {Object.values(obj).map((value, index2) =>
                        <td key={index2}>
                            {value}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>

          </table>   
    </div>
  );
}

const colNames = ["Offence", "Severity"]

function Header1(props){
  return <h1> {props.text}</h1>;
  
}

function Button(props) {
  const isDisabled = props?.disabled ?? false;
  return (
      <button className="custom-button" onClick = {props?.click} style={props?.style} disabled={isDisabled}>{props.buttonText}</button>
  )
}

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

function App() {
  return (
    <div className="App">
          
          <div id="head">
            <div style={{ display: "flex", marginLeft: "20%" }}>
              <img src={image} height={80} width={80} />
              <Header1 text="OFFENCE LIST AND OFFENCE EDITING" />
              <Button buttonText="HELP" style={buttonStyle} />         
            </div>
          </div>

          <div id="table">
            <Table list={list} colNames={colNames} />
          </div>
          
          <div id="inText">
            <p>
              Offence editing and adding:
            </p>
            
            <form>
              Offence name:
              <input type="text" name="inOffence" />
            </form>

            <form>
              Severity level:
              <input type="text" name="inSeverity" />
            </form>

            <form>
              <Button  buttonText="ADD" style={buttonStyle} />
              <Button  buttonText="Edit" style={buttonStyle} />
              <Button  buttonText="Delete" style={buttonStyle} />
            </form>
          </div>

          <div id="buttons">
              <Button  buttonText="BACK" style={buttonStyle2} />
          </div>          

    </div>
  );
}

export default App;
