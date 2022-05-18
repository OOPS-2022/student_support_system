import React from "react";


export default function CreateClickedPledge(){

    const [message, setMessage]=React.useState("");
    const [name, setName]=React.useState("");
  
    const rawHTML = `
    <div>
      <label>
      <input type="checkbox" id="myCheck">
      `+message +`</label>
      <div>
      </div>
    </div>
    `;
  
    const upload=(event)=>{
      Axios.post("http://localhost:3001/createClickedPledge", {
        name: name,
        desc: message
      }).then((res) => {
        alert(res.data);
        });
    };
  
    return(
      <div className='App'>
        <h1>Create Clicked Pledge</h1>
          <label>What do you want your clicked pledge to say?</label>
          <br></br>
          <textarea id="story" name="story" rows="5" cols="33" onChange={(e)=>setMessage(e.target.value)}/> 
          <br></br>
          <label>Name of your pledge:</label>
          <input type='text'onChange={(e)=>setName(e.target.value)}/>
          <h2> Preview of your clicked pledge:</h2>
          <div dangerouslySetInnerHTML={{ __html: rawHTML }}></div>
        <button onClick={upload}>Upload</button>
      </div>
    )
  }